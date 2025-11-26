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
    const [initialDuration, setInitialDuration] = useState(
        (parseInt(localStorage.getItem("timerDuration")) || 5) * 60
    );

    const generateUniqueId = () => Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

    // Fetch all tasks on mount
    const fetchAllTasks = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await tasksAPI.getAllTasks();

            // فیلتر کردن تسک‌ها: فقط تسک‌های اصلی (بدون parent)
            const fetchedTasks = Array.isArray(data)
                ? data
                    .filter(task => !task.parent) // فقط تسک‌های اصلی
                    .map((task, index) => ({
                        id: task.id.toString(),
                        title: task.title || 'بدون عنوان',
                        description: task.description || '',
                        flag_tuNobat: task.flag_tuNobat || false,
                        isDone: !!task.done_date, // چک کردن done_date برای isDone
                        subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(sub => ({
                            id: sub.id,
                            title: sub.title || '',
                            isDone: !!sub.done_date,
                            done_date: sub.done_date || null,
                        })) : [],
                        tags: Array.isArray(task.tags) ? task.tags : [],
                        deadline_date: task.deadline_date || '',
                        hour: task.hour || '',
                        selectedDays: Array.isArray(task.selectedDays) ? task.selectedDays : [],
                        originalIndex: index,
                    }))
                : [];

            setTasks(fetchedTasks);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching tasks:', err.response?.data || err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const addTask = async (taskData) => {
        try {
            // فیلتر کردن ساب‌تسک‌های خالی
            const validSubtasks = (taskData.subtasks || [])
                .filter(sub => sub.title && sub.title.trim() !== '')
                .map(sub => ({
                    title: sub.title.trim(),
                    done_date: null
                }));

            const response = await tasksAPI.addTask({
                title: taskData.title,
                description: taskData.description || '',
                deadline_date: taskData.deadline_date,
                flag_tuNobat: taskData.flag_tuNobat || false,
                hour: taskData.hour || null,
                selectedDays: taskData.selectedDays || [],
                subtasks: validSubtasks,
                tags: taskData.tags || [],
            });

            const newTask = {
                id: response.id.toString(),
                title: response.title || 'بدون عنوان',
                description: response.description || '',
                flag_tuNobat: response.flag_tuNobat || false,
                isDone: response.isDone || false,
                subtasks: Array.isArray(response.subtasks) ? response.subtasks.map(sub => ({
                    id: sub.id,
                    title: sub.title || '',
                    isDone: !!sub.done_date,
                    done_date: sub.done_date || null,
                })) : [],
                tags: Array.isArray(response.tags) ? response.tags : [],
                deadline_date: response.deadline_date || '',
                hour: response.hour || '',
                selectedDays: Array.isArray(response.selectedDays) ? response.selectedDays : [],
                originalIndex: tasks.length,
            };

            setTasks(prev => [...prev, newTask]);
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
            // فیلتر کردن ساب‌تسک‌های خالی
            const validSubtasks = (updatedTask.subtasks || [])
                .filter(sub => sub.title && sub.title.trim() !== '')
                .map(sub => ({
                    id: typeof sub.id === 'number' ? sub.id : null,
                    title: sub.title.trim(),
                    done_date: sub.done_date || null
                }));

            const response = await tasksAPI.updateTask(updatedTask.id, {
                title: updatedTask.title,
                description: updatedTask.description || '',
                deadline_date: updatedTask.deadline_date,
                flag_tuNobat: updatedTask.flag_tuNobat || false,
                hour: updatedTask.hour || null,
                selectedDays: updatedTask.selectedDays || [],
                subtasks: validSubtasks,
                tags: updatedTask.tags || [],
                isDone: updatedTask.isDone,
            });

            const editedTask = {
                id: response.id.toString(),
                title: response.title || 'بدون عنوان',
                description: response.description || '',
                flag_tuNobat: response.flag_tuNobat || false,
                isDone: response.isDone || false,
                subtasks: Array.isArray(response.subtasks) ? response.subtasks.map(sub => ({
                    id: sub.id,
                    title: sub.title || '',
                    isDone: !!sub.done_date,
                    done_date: sub.done_date || null,
                })) : [],
                tags: Array.isArray(response.tags) ? response.tags : [],
                deadline_date: response.deadline_date || '',
                hour: response.hour || '',
                selectedDays: Array.isArray(response.selectedDays) ? response.selectedDays : [],
                originalIndex: updatedTask.originalIndex || 0,
            };

            setTasks(prev => prev.map(t => t.id === editedTask.id ? editedTask : t));
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

            // استفاده از response.data.done مطابق کد قدیمی
            const isDone = response.done !== undefined ? response.done : done;

            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === taskId ? { ...t, isDone } : t))
            );

            return { success: true, task: { ...currentTask, isDone } };
        } catch (err) {
            console.error('Error toggling task:', err.response?.data || err.message);

            // اگر 401 بود، refresh token
            if (err.response?.status === 401) {
                const refresh = localStorage.getItem('refreshToken');
                if (refresh) {
                    try {
                        const refreshResponse = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
                        localStorage.setItem('accessToken', refreshResponse.data.access);
                        // دوباره تلاش
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

    const startTimer = (taskId) => setTimers(prev => ({
        ...prev,
        [taskId]: { ...prev[taskId], isRunning: true }
    }));

    const stopTimer = (taskId) => setTimers(prev => ({
        ...prev,
        [taskId]: { ...prev[taskId], isRunning: false }
    }));

    const resetTimerForTask = (taskId) => setTimers(prev => ({
        ...prev,
        [taskId]: { remaining: initialDuration, isRunning: false }
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const updated = { ...prev };
                let changed = false;
                Object.keys(updated).forEach(id => {
                    if (updated[id]?.isRunning && updated[id].remaining > 0) {
                        updated[id].remaining -= 1;
                        changed = true;
                    } else if (updated[id]?.isRunning) {
                        updated[id].isRunning = false;
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === "timerDuration") {
                const newDuration = (parseInt(e.newValue) || 5) * 60;
                setInitialDuration(newDuration);
                setTimers(prev => {
                    const updated = {};
                    Object.keys(prev).forEach(id => {
                        updated[id] = { remaining: newDuration, isRunning: false };
                    });
                    return updated;
                });
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <TaskContext.Provider value={{
            tasks,
            setTasks,
            timers,
            setTimers,
            initialDuration,
            isLoading,
            addTask,
            editTask,
            deleteTask,
            toggleTask,
            startTimer,
            stopTimer,
            resetTimerForTask,
            generateUniqueId,
            fetchAllTasks,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;