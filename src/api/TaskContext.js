import React, { createContext, useState, useEffect } from "react";
import { tasksAPI } from "./apiService";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasksByCategory, setTasksByCategory] = useState({
        khak_khorde: [],
        rumiz: [],
        nobatesh_mishe: [],
    });

    const [loadingByCategory, setLoadingByCategory] = useState({
        khak_khorde: true,
        rumiz: true,
        nobatesh_mishe: true,
    });

    const [timers, setTimers] = useState({});
    const [currentCategory, setCurrentCategory] = useState('khak_khorde');

    const generateUniqueId = () =>
        Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

    const parseDuration = (durationStr) => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':');
        const hours = parseInt(parts[0] || 0);
        const mins = parseInt(parts[1] || 0);
        const secs = parseInt(parts[2] || 0);
        return hours * 3600 + mins * 60 + secs;
    };

    const formatDurationForAPI = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const normalizeTask = (task, index) => {
        return {
            id: task.id.toString(),
            title: task.title || 'بدون عنوان',
            description: task.description || '',
            flag_tuNobat: task.flag_tuNobat || false,
            isDone: !!task.done_date,
            done_date: task.done_date || null,
            subtasks: Array.isArray(task.subtasks)
                ? task.subtasks.map(sub => ({
                    id: sub.id,
                    title: sub.title || '',
                    isDone: !!sub.done_date,
                    done_date: sub.done_date || null,
                }))
                : [],
            tags: Array.isArray(task.categories) ? task.categories : [],
            deadline_date: task.deadline_date || null,
            deadline_time: task.deadline_time || '',
            hour: task.deadline_time || '',
            selectedDays: Array.isArray(task.repeat_days) ? task.repeat_days : [],
            is_routine_active: task.is_routine_active || false,
            repeat_days: Array.isArray(task.repeat_days) ? task.repeat_days : [],
            routine_father: task.routine_father || null,
            categories: Array.isArray(task.categories) ? task.categories : [],
            totalDuration: task.duration ? parseDuration(task.duration) : 0,
            duration: task.duration || '00:00:00',
            originalIndex: index,
        };
    };

    const fetchTasksByCategory = async (category) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoadingByCategory(prev => ({ ...prev, [category]: false }));
            return;
        }

        try {
            setLoadingByCategory(prev => ({ ...prev, [category]: true }));
            let data;

            switch (category) {
                case 'khak_khorde':
                    data = await tasksAPI.getKhakKhordeTasks();
                    break;
                case 'rumiz':
                    data = await tasksAPI.getRumizTasks();
                    break;
                case 'nobatesh_mishe':
                    data = await tasksAPI.getNobateshMisheTasks();
                    break;
                default:
                    data = [];
            }

            let tasksArray = [];
            if (Array.isArray(data)) {
                tasksArray = data;
            } else if (data && typeof data === 'object') {
                if (category === 'rumiz') {
                    tasksArray = [
                        ...(data.completed_tasks || []),
                        ...(data.not_completed_tasks || [])
                    ];
                } else {
                    tasksArray = data.tasks || data.not_completed_tasks || data.completed_tasks || [];
                }
            }

            const fetchedTasks = Array.isArray(tasksArray)
                ? tasksArray.map((task, index) => normalizeTask(task, index))
                : [];

            setTasksByCategory(prev => ({
                ...prev,
                [category]: fetchedTasks
            }));

            setCurrentCategory(category);
        } catch (err) {
            console.error(`Error fetching tasks for ${category}:`, err.response?.data || err.message);
        } finally {
            setLoadingByCategory(prev => ({ ...prev, [category]: false }));
        }
    };

    const refreshAllCategories = async () => {
        await Promise.all([
            fetchTasksByCategory('khak_khorde'),
            fetchTasksByCategory('rumiz'),
            fetchTasksByCategory('nobatesh_mishe')
        ]);
    };

    const fetchAllTasks = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoadingByCategory(prev => ({ ...prev, [currentCategory]: false }));
            return;
        }

        try {
            setLoadingByCategory(prev => ({ ...prev, [currentCategory]: true }));
            const data = await tasksAPI.getAllTasks();

            const fetchedTasks = Array.isArray(data)
                ? data
                    .filter(task => !task.parent)
                    .map((task, index) => normalizeTask(task, index))
                : [];

            setTasksByCategory(prev => ({
                ...prev,
                [currentCategory]: fetchedTasks
            }));
        } catch (err) {
            console.error('Error fetching tasks:', err.response?.data || err.message);
        } finally {
            setLoadingByCategory(prev => ({ ...prev, [currentCategory]: false }));
        }
    };

    useEffect(() => {
        refreshAllCategories();
    }, []);

    const addTask = async (taskData) => {
        try {
            const getTodayDateStr = () => new Date().toISOString().split('T')[0];

            const validSubtasks = (taskData.subtasks || [])
                .filter(sub => sub.title && sub.title.trim() !== '')
                .map(sub => ({
                    id: sub.id != null ? Number(sub.id) : null,
                    title: sub.title.trim(),
                    done_date: sub.isDone ? getTodayDateStr() : null
                }));

            const repeatDays = Array.isArray(taskData.repeat_days) ? taskData.repeat_days : [];

            const response = await tasksAPI.addTask({
                title: taskData.title,
                description: taskData.description || '',
                deadline_date: taskData.deadline_date,
                deadline_time: taskData.deadline_time || '23:59:00',
                flag_tuNobat: taskData.flag_tuNobat || false,
                is_routine_active: taskData.is_routine_active || false,
                repeat_days: repeatDays,
                subtasks: validSubtasks,
                categories: taskData.categories || [],
                done_date: taskData.done_date || null,
                done_time: taskData.done_time || null,
                duration: taskData.duration || '00:00:00',
                routine_father: taskData.routine_father || null,
            });

            const newTask = normalizeTask(response, 0);
            await refreshAllCategories();

            return { success: true, task: newTask };

        } catch (err) {
            console.error('Error adding task:', err.response?.data || err.message);
            return {
                success: false,
                error: err.response?.data || 'خطایی در ایجاد تسک رخ داد'
            };
        }
    };

    const editTask = async (updatedTask, { silent = false } = {}) => {
        try {
            const getTodayDateStr = () => new Date().toISOString().split('T')[0];
            const repeatDays = Array.isArray(updatedTask.repeat_days) ? updatedTask.repeat_days : [];
            const taskDoneDate = updatedTask.isDone ? getTodayDateStr() : null;

            const validSubtasks = (updatedTask.subtasks || [])
                .filter(sub => sub.title && sub.title.trim() !== '')
                .map(sub => ({
                    id: sub.id != null ? Number(sub.id) : null,
                    title: sub.title.trim(),
                    done_date: sub.isDone ? getTodayDateStr() : null
                }));

            if (silent) {
                console.log('🔍 SILENT EDIT - Subtasks being sent:', validSubtasks);
                console.log('🔍 SILENT EDIT - Subtask IDs:', validSubtasks.map(s => s.id));
            }

            const response = await tasksAPI.updateTask(updatedTask.id, {
                title: updatedTask.title,
                description: updatedTask.description || '',
                deadline_date: updatedTask.deadline_date,
                deadline_time: updatedTask.deadline_time || '23:59:00',
                flag_tuNobat: updatedTask.flag_tuNobat || false,
                is_routine_active: updatedTask.is_routine_active || false,
                repeat_days: repeatDays,
                subtasks: validSubtasks,
                categories: updatedTask.categories || [],
                done_date: taskDoneDate,
                done_time: taskDoneDate ? (updatedTask.deadline_time || '23:59:00') : null,
                duration: updatedTask.duration || '00:00:00',
                routine_father: updatedTask.routine_father || null,
            });

            const editedTask = normalizeTask(response, updatedTask.originalIndex || 0);

            if (silent) {
                console.log('🔍 SILENT EDIT - Response subtasks:', response.subtasks);
            }

            if (silent) {
                setTasksByCategory(prev => {
                    const patch = (list) =>
                        list.map(t => t.id === editedTask.id ? editedTask : t);
                    return {
                        khak_khorde: patch(prev.khak_khorde),
                        rumiz: patch(prev.rumiz),
                        nobatesh_mishe: patch(prev.nobatesh_mishe),
                    };
                });
            } else {
                await refreshAllCategories();
            }

            return { success: true, task: editedTask };

        } catch (err) {
            console.error('Error updating task:', err.response?.data || err.message);
            return {
                success: false,
                error: err.response?.data || 'خطایی در ویرایش تسک رخ داد'
            };
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await tasksAPI.deleteTask(taskId);
            setTimers(prev => {
                const { [taskId]: _, ...rest } = prev;
                return rest;
            });
            await refreshAllCategories();

            return { success: true };

        } catch (err) {
            console.error('Error deleting task:', err.response?.data || err.message);
            return {
                success: false,
                error: err.response?.data?.detail || 'خطایی در حذف تسک رخ داد'
            };
        }
    };

    const toggleTask = async (taskId) => {
        const currentTask =
            tasksByCategory.khak_khorde.find(t => t.id === taskId) ||
            tasksByCategory.rumiz.find(t => t.id === taskId) ||
            tasksByCategory.nobatesh_mishe.find(t => t.id === taskId);

        if (!currentTask) {
            return { success: false, error: 'تسک یافت نشد' };
        }

        const done = !currentTask.isDone;

        try {
            const response = await tasksAPI.toggleTask(taskId, done);
            const isDone = response.done !== undefined ? response.done : done;

            await refreshAllCategories();

            return { success: true, task: { ...currentTask, isDone } };
        } catch (err) {
            console.error('Error toggling task:', err.response?.data || err.message);
            return {
                success: false,
                error: err.response?.data?.error || err.response?.data?.detail || 'خطایی در تغییر وضعیت تسک رخ داد'
            };
        }
    };

    const startTimer = (taskId) => {
        setTimers(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                isRunning: true,
                sessionElapsed: 0
            }
        }));
    };

    const pauseTimer = (taskId) => {
        setTimers(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                isRunning: false
            }
        }));
    };

    const stopTimer = async (taskId) => {
        const currentTimer = timers[taskId];
        if (!currentTimer || !currentTimer.isRunning) {
            return { success: false };
        }

        try {
            const currentTask =
                tasksByCategory.khak_khorde.find(t => t.id === taskId) ||
                tasksByCategory.rumiz.find(t => t.id === taskId) ||
                tasksByCategory.nobatesh_mishe.find(t => t.id === taskId);

            const previousDuration = currentTask?.totalDuration || 0;
            const newTotalDuration = previousDuration + currentTimer.elapsed;

            const formattedDuration = formatDurationForAPI(newTotalDuration);
            await tasksAPI.setTaskDuration(taskId, formattedDuration);

            setTasksByCategory(prev => {
                const updateList = (list) =>
                    list.map(t =>
                        t.id === taskId
                            ? {
                                ...t,
                                totalDuration: newTotalDuration,
                                duration: formattedDuration
                            }
                            : t
                    );

                return {
                    khak_khorde: updateList(prev.khak_khorde),
                    rumiz: updateList(prev.rumiz),
                    nobatesh_mishe: updateList(prev.nobatesh_mishe),
                };
            });

            setTimers(prev => ({
                ...prev,
                [taskId]: { elapsed: 0, isRunning: false, sessionElapsed: 0 }
            }));

            return {
                success: true,
                totalDuration: newTotalDuration,
                duration: formattedDuration
            };
        } catch (err) {
            console.error('Error sending duration:', err.message);
            return {
                success: false,
                error: err.message
            };
        }
    };

    const resetTimerForTask = async (taskId) => {
        const currentTimer = timers[taskId];

        if (currentTimer?.elapsed > 0) {
            try {
                const currentTask =
                    tasksByCategory.khak_khorde.find(t => t.id === taskId) ||
                    tasksByCategory.rumiz.find(t => t.id === taskId) ||
                    tasksByCategory.nobatesh_mishe.find(t => t.id === taskId);

                const previousDuration = currentTask?.totalDuration || 0;
                const newTotalDuration = previousDuration + currentTimer.elapsed;

                const formattedDuration = formatDurationForAPI(newTotalDuration);
                await tasksAPI.setTaskDuration(taskId, formattedDuration);

                setTasksByCategory(prev => {
                    const updateList = (list) =>
                        list.map(t =>
                            t.id === taskId
                                ? {
                                    ...t,
                                    totalDuration: newTotalDuration,
                                    duration: formattedDuration
                                }
                                : t
                        );

                    return {
                        khak_khorde: updateList(prev.khak_khorde),
                        rumiz: updateList(prev.rumiz),
                        nobatesh_mishe: updateList(prev.nobatesh_mishe),
                    };
                });
            } catch (err) {
                console.error('Error sending duration:', err.message);
            }
        }

        setTimers(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                elapsed: 0,
                isRunning: false,
                sessionElapsed: currentTimer?.elapsed || 0
            }
        }));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const updated = { ...prev };
                let changed = false;

                Object.keys(updated).forEach(id => {
                    if (updated[id]?.isRunning) {
                        updated[id] = {
                            ...updated[id],
                            elapsed: updated[id].elapsed + 1
                        };
                        changed = true;
                    }
                });

                return changed ? updated : prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const tasks = tasksByCategory[currentCategory] || [];
    const isLoading = loadingByCategory[currentCategory] || false;
    const setTasks = (updater) => {
        setTasksByCategory(prev => {
            const currentList = prev[currentCategory] || [];
            const nextList =
                typeof updater === "function" ? updater(currentList) : updater;

            return {
                ...prev,
                [currentCategory]: nextList
            };
        });
    };

    const getTasksByCategory = (category) => {
        return tasksByCategory[category] || [];
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            setTasks,
            isLoading,
            tasksByCategory,
            loadingByCategory,
            timers,
            setTimers,
            currentCategory,
            setCurrentCategory,
            addTask,
            editTask,
            deleteTask,
            toggleTask,
            startTimer,
            pauseTimer,
            stopTimer,
            resetTimerForTask,
            generateUniqueId,
            fetchAllTasks,
            fetchTasksByCategory,
            refreshAllCategories,
            getTasksByCategory,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;