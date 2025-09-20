import React, { createContext, useState, useEffect, useRef } from "react";
import axios from 'axios';

export const TaskContext = createContext();
const API_BASE = 'http://171.22.24.204:8000';

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const [initialDuration, setInitialDuration] = useState((parseInt(localStorage.getItem("timerDuration")) || 5) * 60);
    const isTicking = useRef(false);

    const refreshToken = async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) return false;
        try {
            const response = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
            localStorage.setItem('accessToken', response.data.access);
            return true;
        } catch (err) {
            console.error('Token refresh failed:', err.response?.data || err.message);
            return false;
        }
    };

    const fetchTasks = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
            const response = await axios.get(`${API_BASE}/tasks/all_tasks/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedTasks = response.data.map((task, index) => ({
                id: task.id.toString(),
                title: task.title || 'Untitled',
                description: task.description || '',
                flag_tuNobat: task.flag_tuNobat || false,
                isDone: task.isDone || false,
                subtasks: task.subtasks || [],
                tags: task.tags || [],
                deadline_date: task.deadline_date || '',
                hour: task.hour || '',
                selectedDays: task.selectedDays || [],
                originalIndex: index,
            }));
            setTasks(fetchedTasks);
            setTimers((prev) => {
                const updatedTimers = { ...prev };
                fetchedTasks.forEach((task) => {
                    if (!updatedTimers[task.id]) {
                        updatedTimers[task.id] = { remaining: initialDuration, isRunning: false };
                    }
                });
                return updatedTimers;
            });
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) fetchTasks();
            }
        }
    };

    const editTask = async (task) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return { success: false, error: 'لطفاً ابتدا وارد سیستم شوید' };

        try {
            const response = await axios.put(`${API_BASE}/tasks/${task.id}/edit_task/`, task, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedTask = {
                id: response.data.id.toString(),
                title: response.data.title || 'Untitled',
                description: response.data.description || '',
                flag_tuNobat: response.data.flag_tuNobat || false,
                isDone: response.data.isDone || false,
                subtasks: response.data.subtasks || [],
                tags: response.data.tags || [],
                deadline_date: response.data.deadline_date || '',
                hour: response.data.hour || '',
                selectedDays: response.data.selectedDays || [],
                originalIndex: task.originalIndex,
            };
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
            return { success: true, task: updatedTask };
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    return await editTask(task); // Retry after token refresh
                } else {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userId');
                    return { success: false, error: 'لطفاً دوباره وارد سیستم شوید' };
                }
            } else {
                return { success: false, error: err.response?.data?.detail || 'خطایی در ویرایش تسک رخ داد' };
            }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const newDuration = (parseInt(localStorage.getItem("timerDuration")) || 5) * 60;
            setInitialDuration(newDuration);
            setTimers((prev) => {
                const updatedTimers = {};
                Object.keys(prev).forEach((taskId) => {
                    updatedTimers[taskId] = { remaining: newDuration, isRunning: false };
                });
                return updatedTimers;
            });
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const startTimer = (taskId) => {
        setTimers((prev) => {
            const timer = prev[taskId] || { remaining: initialDuration, isRunning: false };
            if (!timer.isRunning) {
                return { ...prev, [taskId]: { ...timer, isRunning: true } };
            }
            return prev;
        });
    };

    const stopTimer = (taskId) => {
        setTimers((prev) => {
            const timer = prev[taskId];
            if (timer && timer.isRunning) {
                return { ...prev, [taskId]: { ...timer, isRunning: false } };
            }
            return prev;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isTicking.current) return;
            isTicking.current = true;
            setTimers((prev) => {
                const updatedTimers = { ...prev };
                let hasChanges = false;
                Object.keys(updatedTimers).forEach((id) => {
                    const timer = updatedTimers[id];
                    if (timer.isRunning && timer.remaining > 0) {
                        timer.remaining = Math.max(0, timer.remaining - 1);
                        hasChanges = true;
                    }
                    if (timer.remaining <= 0 && timer.isRunning) {
                        timer.isRunning = false;
                        hasChanges = true;
                    }
                });
                isTicking.current = false;
                return hasChanges ? updatedTimers : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TaskContext.Provider
            value={{
                tasks,
                setTasks,
                timers,
                initialDuration,
                startTimer,
                stopTimer,
                editTask, // Add editTask to context
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;