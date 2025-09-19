import React, { createContext, useState, useEffect, useRef } from "react";
import axios from 'axios';

export const TaskContext = createContext();
const API_BASE = 'http://171.22.24.204:8000';

export const TaskProvider = ({ children }) => {
    // خواندن مقدار تایمر از localStorage با مقدار پیش‌فرض 5 دقیقه
    const [initialDuration, setInitialDuration] = useState((parseInt(localStorage.getItem("timerDuration")) || 5) * 60); // تبدیل دقیقه به ثانیه
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const isTicking = useRef(false);

    // به‌روزرسانی initialDuration هنگام تغییر timerDuration در localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const newDuration = (parseInt(localStorage.getItem("timerDuration")) || 5) * 60;
            setInitialDuration(newDuration);
            // ریست تمام تایمرها به مقدار جدید
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

    const fetchTasks = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return;
        }

        try {
            const response = await axios.get(`${API_BASE}/tasks/all_tasks/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data.map((task, index) => ({
                id: task.id.toString(),
                title: task.title,
                description: task.description || '',
                flag_tuNobat: task.flag_tuNobat || false,
                isDone: task.isDone || false,
                subtasks: task.subtasks || [],
                tags: task.tags || [],
                deadline_date: task.deadline_date || '',
                hour: task.hour || '',
                selectedDays: task.selectedDays || [],
                originalIndex: index,
            })));
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) fetchTasks();
            }
        }
    };

    const refreshToken = async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) return false;

        try {
            const response = await axios.post(`${API_BASE}/api/token/refresh/`, { refresh });
            localStorage.setItem('accessToken', response.data.access);
            return true;
        } catch (err) {
            return false;
        }
    };

    useEffect(() => {
        fetchTasks();
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

    const resetTimerForTask = (taskId) => {
        setTimers((prev) => {
            return {
                ...prev,
                [taskId]: { remaining: initialDuration, isRunning: false },
            };
        });
    };

    const addTask = async (newTask) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return;
        }

        try {
            const response = await axios.post(`${API_BASE}/tasks/add_task/`, newTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks((prev) => [
                ...prev,
                {
                    id: response.data.id.toString(),
                    title: newTask.title,
                    description: newTask.description || '',
                    deadline_date: newTask.deadline_date,
                    flag_tuNobat: newTask.flag_tuNobat || false,
                    hour: newTask.hour || '',
                    selectedDays: newTask.selectedDays || [],
                    subtasks: newTask.subtasks || [],
                    tags: newTask.tags || [],
                    isDone: false,
                    originalIndex: prev.length,
                },
            ]);
        } catch (err) {
        }
    };

    const updateTask = async (updatedTask) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            return;
        }

        try {
            await axios.put(`${API_BASE}/tasks/${updatedTask.id}/edit_task/`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks((prev) => {
                const otherTasks = prev.filter((task) => task.id !== updatedTask.id);
                if (updatedTask.isDone) {
                    return [...otherTasks, updatedTask];
                } else {
                    const insertIndex = Math.min(updatedTask.originalIndex || 0, otherTasks.length);
                    return [
                        ...otherTasks.slice(0, insertIndex),
                        updatedTask,
                        ...otherTasks.slice(insertIndex),
                    ];
                }
            });
        } catch (err) {
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isTicking.current) {
                return;
            }
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

        return () => {
            clearInterval(interval);
        };
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
                resetTimerForTask,
                addTask,
                updateTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;