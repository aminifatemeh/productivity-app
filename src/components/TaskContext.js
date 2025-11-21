// components/TaskContext.js
import React, { createContext, useState, useEffect } from "react";
import { tasksAPI } from "../api/apiService";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const [initialDuration, setInitialDuration] = useState(
        (parseInt(localStorage.getItem("timerDuration")) || 5) * 60
    );

    const generateUniqueId = () => Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

    const addTask = async (taskData) => {
        try {
            const response = await tasksAPI.addTask({
                title: taskData.title,
                description: taskData.description || '',
                deadline_date: taskData.deadline_date,
                flag_tuNobat: taskData.flag_tuNobat || false,
                hour: taskData.hour || null,
                selectedDays: taskData.selectedDays || [],
                subtasks: taskData.subtasks || [],
                tags: taskData.tags || [],
            });

            const newTask = {
                id: response.id.toString(),
                title: response.title || 'بدون عنوان',
                description: response.description || '',
                flag_tuNobat: response.flag_tuNobat || false,
                isDone: response.isDone || false,
                subtasks: response.subtasks || [],
                tags: response.tags || [],
                deadline_date: response.deadline_date || '',
                hour: response.hour || '',
                selectedDays: response.selectedDays || [],
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
            const response = await tasksAPI.updateTask(updatedTask.id, {
                title: updatedTask.title,
                description: updatedTask.description || '',
                deadline_date: updatedTask.deadline_date,
                flag_tuNobat: updatedTask.flag_tuNobat || false,
                hour: updatedTask.hour || null,
                selectedDays: updatedTask.selectedDays || [],
                subtasks: updatedTask.subtasks || [],
                tags: updatedTask.tags || [],
                isDone: updatedTask.isDone,
            });

            const editedTask = {
                id: response.id.toString(),
                title: response.title || 'بدون عنوان',
                description: response.description || '',
                flag_tuNobat: response.flag_tuNobat || false,
                isDone: response.isDone || false,
                subtasks: response.subtasks || [],
                tags: response.tags || [],
                deadline_date: response.deadline_date || '',
                hour: response.hour || '',
                selectedDays: response.selectedDays || [],
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
        const task = tasks.find(t => t.id === taskId);
        if (!task) return { success: false, error: 'تسک یافت نشد' };

        try {
            const response = await tasksAPI.toggleTask(taskId);
            const updatedTask = {
                ...task,
                isDone: response.isDone !== undefined ? response.isDone : !task.isDone,
            };
            setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
            return { success: true, task: updatedTask };
        } catch (err) {
            console.error('Error toggling task:', err.response?.data || err.message);
            return {
                success: false,
                error: err.response?.data?.detail || 'خطایی در تغییر وضعیت تسک رخ داد'
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
            initialDuration,
            addTask,
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