// components/TaskProvider.js
import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const [initialDuration, setInitialDuration] = useState(
        (parseInt(localStorage.getItem("timerDuration")) || 5) * 60
    );

    // فقط برای تایمرها استفاده می‌شه (localStorage فقط برای تنظیمات)
    const generateUniqueId = () => Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

    // ویرایش تسک (فقط state آپدیت می‌شه — ذخیره‌سازی سمت سرور در AddTaskModal انجام میشه)
    const editTask = (updatedTask) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    // حذف تسک
    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setTimers(prev => {
            const { [taskId]: _, ...rest } = prev;
            return rest;
        });
    };

    // تغییر وضعیت انجام شده
    const toggleTask = (taskId) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, isDone: !t.isDone } : t
        ));
    };

    // کنترل تایمرها
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

    // تایمر اصلی (هر ثانیه)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const updated = { ...prev };
                let changed = false;
                Object.keys(updated).forEach(id => {
                    if (updated[id].isRunning && updated[id].remaining > 0) {
                        updated[id].remaining -= 1;
                        changed = true;
                    } else if (updated[id].isRunning) {
                        updated[id].isRunning = false;
                        changed = true;
                    }
                });
                return changed ? updated : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // همگام‌سازی با تغییر مدت زمان تایمر
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
            initialDuration,
            editTask,
            deleteTask,
            toggleTask,
            startTimer,
            stopTimer,
            resetTimerForTask,
            generateUniqueId,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;