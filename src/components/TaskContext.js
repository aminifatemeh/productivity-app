// components/TaskContext.js
import React, { createContext, useState, useEffect } from "react";
import { tasksAPI } from "../api/apiService";
import axios from 'axios';

const API_BASE = 'http://5.202.57.77:8000';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentCategory, setCurrentCategory] = useState('khak_khorde');

    const generateUniqueId = () => Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

    // Helper function to normalize task data from API response
    const normalizeTask = (task, index) => {
        console.log('Normalizing task:', {
            id: task.id,
            title: task.title,
            done_date: task.done_date,
            categories: task.categories,
            deadline_time: task.deadline_time,
            duration: task.duration,
            deadline_date: task.deadline_date
        });

        return {
            id: task.id.toString(),
            title: task.title || 'بدون عنوان',
            description: task.description || '',
            flag_tuNobat: task.flag_tuNobat || false,
            isDone: !!task.done_date,
            done_date: task.done_date || null,
            subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(sub => ({
                id: sub.id,
                title: sub.title || '',
                isDone: !!sub.done_date,
                done_date: sub.done_date || null,
            })) : [],
            tags: Array.isArray(task.categories) ? task.categories : [],
            deadline_date: task.deadline_date || null, // نگه‌داری تاریخ میلادی
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

    // Parse duration string "HH:MM:SS" to seconds
    const parseDuration = (durationStr) => {
        if (!durationStr) return 0;
        const parts = durationStr.split(':');
        const hours = parseInt(parts[0] || 0);
        const mins = parseInt(parts[1] || 0);
        const secs = parseInt(parts[2] || 0);
        return hours * 3600 + mins * 60 + secs;
    };

    // Fetch tasks by category
    const fetchTasksByCategory = async (category) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            let data;

            console.log(`Fetching tasks for category: ${category}`);

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

            console.log(`Raw API response for ${category}:`, data);

            // Handle different response formats
            let tasksArray = [];
            if (Array.isArray(data)) {
                // Direct array response
                tasksArray = data;
            } else if (data && typeof data === 'object') {
                // Object with completed_tasks and not_completed_tasks
                if (category === 'rumiz') {
                    tasksArray = [
                        ...(data.completed_tasks || []),
                        ...(data.not_completed_tasks || [])
                    ];
                } else {
                    // For other categories, try to find tasks in common keys
                    tasksArray = data.tasks || data.not_completed_tasks || data.completed_tasks || [];
                }
            }

            console.log(`Tasks array for ${category}:`, tasksArray);
            console.log(`Is array: ${Array.isArray(tasksArray)}, Length: ${tasksArray?.length}`);

            const fetchedTasks = Array.isArray(tasksArray)
                ? tasksArray.map((task, index) => normalizeTask(task, index))
                : [];

            console.log(`Normalized tasks for ${category}:`, fetchedTasks);

            setTasks(fetchedTasks);
            setCurrentCategory(category);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching tasks:', err.response?.data || err.message);
            setIsLoading(false);
        }
    };

    // Fetch all tasks (kept for compatibility)
    const fetchAllTasks = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await tasksAPI.getAllTasks();

            const fetchedTasks = Array.isArray(data)
                ? data
                    .filter(task => !task.parent)
                    .map((task, index) => normalizeTask(task, index))
                : [];

            setTasks(fetchedTasks);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching tasks:', err.response?.data || err.message);
            setIsLoading(false);
        }
    };

    // بجای fetchAllTasks، fetchTasksByCategory را اجرا کن
    useEffect(() => {
        fetchTasksByCategory(currentCategory);
    }, []);

    const addTask = async (taskData) => {
        try {
            const validSubtasks = (taskData.subtasks || [])
                .filter(sub => sub.title && sub.title.trim() !== '')
                .map(sub => ({
                    title: sub.title.trim(),
                    done_date: null
                }));

            // اطمینان از اینکه repeat_days آرایه است
            const repeatDays = Array.isArray(taskData.repeat_days) ? taskData.repeat_days : [];

            const response = await tasksAPI.addTask({
                title: taskData.title,
                description: taskData.description || '',
                deadline_date: taskData.deadline_date,
                deadline_time: taskData.deadline_time || '23:59:00',
                flag_tuNobat: taskData.flag_tuNobat || false,
                is_routine_active: taskData.is_routine_active || false,
                repeat_days: repeatDays, // همیشه آرایه
                subtasks: validSubtasks,
                categories: taskData.categories || [],
                done_date: taskData.done_date || null,
                done_time: taskData.done_time || null,
                duration: taskData.duration || '00:00:00',
                routine_father: taskData.routine_father || null,
            });

            const newTask = normalizeTask(response, tasks.length);
            setTasks(prev => [...prev, newTask]);

            // Refresh current category to get updated list
            await fetchTasksByCategory(currentCategory);

            return { success: true, task: newTask };
        } catch (err) {
            console.error('Error adding task:', err.response?.data || err.message);
            return {
                success: false,
                error: err.response?.data || 'خطایی در ایجاد تسک رخ داد'
            };
        }
    };

    const editTask = async (updatedTask) => {
        try {
            const validSubtasks = (updatedTask.subtasks || [])
                .filter(sub => sub.title && sub.title.trim() !== '')
                .map(sub => ({
                    id: typeof sub.id === 'number' ? sub.id : null,
                    title: sub.title.trim(),
                    done_date: sub.done_date || null
                }));

            // اطمینان از اینکه repeat_days آرایه است
            const repeatDays = Array.isArray(updatedTask.repeat_days) ? updatedTask.repeat_days : [];

            const response = await tasksAPI.updateTask(updatedTask.id, {
                title: updatedTask.title,
                description: updatedTask.description || '',
                deadline_date: updatedTask.deadline_date,
                deadline_time: updatedTask.deadline_time || '23:59:00',
                flag_tuNobat: updatedTask.flag_tuNobat || false,
                is_routine_active: updatedTask.is_routine_active || false,
                repeat_days: repeatDays, // همیشه آرایه
                subtasks: validSubtasks,
                categories: updatedTask.categories || [],
                done_date: updatedTask.done_date || null,
                done_time: updatedTask.done_time || null,
                duration: updatedTask.duration || '00:00:00',
                routine_father: updatedTask.routine_father || null,
            });

            const editedTask = normalizeTask(response, updatedTask.originalIndex || 0);
            setTasks(prev => prev.map(t => t.id === editedTask.id ? editedTask : t));

            // Refresh current category to get updated list
            await fetchTasksByCategory(currentCategory);

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
            setTasks(prev => prev.filter(t => t.id !== taskId));
            setTimers(prev => {
                const { [taskId]: _, ...rest } = prev;
                return rest;
            });

            // Refresh current category to get updated list
            await fetchTasksByCategory(currentCategory);

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
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return { success: false, error: 'لطفاً ابتدا وارد سیستم شوید' };
        }

        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask) {
            return { success: false, error: 'تسک یافت نشد' };
        }

        const done = !currentTask.isDone;

        try {
            const response = await tasksAPI.toggleTask(taskId, done);
            const isDone = response.done !== undefined ? response.done : done;

            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskId ? { ...t, isDone } : t))
            );

            // Refresh current category to get updated list
            await fetchTasksByCategory(currentCategory);

            return { success: true, task: { ...currentTask, isDone } };
        } catch (err) {
            console.error('Error toggling task:', err.response?.data || err.message);

            if (err.response?.status === 401) {
                const refresh = localStorage.getItem('refreshToken');
                if (refresh) {
                    try {
                        const refreshResponse = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
                        localStorage.setItem('accessToken', refreshResponse.data.access);
                        return await toggleTask(taskId);
                    } catch (refreshErr) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('username');
                        localStorage.removeItem('userId');
                        return { success: false, error: 'لطفاً دوباره وارد سیستم شوید' };
                    }
                }
            }

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
                elapsed: prev[taskId]?.elapsed || 0,
                isRunning: true
            }
        }));
    };

    const formatDurationForAPI = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const stopTimer = async (taskId) => {
        const currentTimer = timers[taskId];
        if (!currentTimer) return;

        setTimers(prev => ({
            ...prev,
            [taskId]: { ...prev[taskId], isRunning: false }
        }));

        try {
            const currentTask = tasks.find(t => t.id === taskId);
            const previousDuration = currentTask?.totalDuration || 0;
            const newTotalDuration = previousDuration + currentTimer.elapsed;

            const formattedDuration = formatDurationForAPI(newTotalDuration);
            await tasksAPI.setTaskDuration(taskId, formattedDuration);

            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, totalDuration: newTotalDuration } : t
            ));

            setTimers(prev => ({
                ...prev,
                [taskId]: { elapsed: 0, isRunning: false }
            }));

        } catch (err) {
            console.error('Error sending duration:', err.message);
        }
    };

    const resetTimerForTask = async (taskId) => {
        const currentTimer = timers[taskId];

        if (currentTimer?.isRunning && currentTimer.elapsed > 0) {
            await stopTimer(taskId);
        }

        setTimers(prev => ({
            ...prev,
            [taskId]: { elapsed: 0, isRunning: false }
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

    return (
        <TaskContext.Provider value={{
            tasks,
            setTasks,
            timers,
            setTimers,
            isLoading,
            currentCategory,
            addTask,
            editTask,
            deleteTask,
            toggleTask,
            startTimer,
            stopTimer,
            resetTimerForTask,
            generateUniqueId,
            fetchAllTasks,
            fetchTasksByCategory,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;