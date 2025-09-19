import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const initialDuration = 20 * 60; // 20 minutes in seconds
    const [tasks, setTasks] = useState([
        {
            id: "1",
            title: "خرید مواد غذایی",
            description: "خرید نان، شیر، میوه و سبزیجات",
            flag_tuNobat: true,
            isDone: false,
            subtasks: [
                { id: "1-1", title: "خرید نان سنگک", done_date: null },
                { id: "1-2", title: "خرید شیر کم چرب", done_date: null }
            ],
            tags: [{ name: "خانه", color: "#34AA7B" }],
            deadline_date: "1404/06/29",
            hour: "10:00",
            selectedDays: ["ش", "د"],
            originalIndex: 0
        },
        {
            id: "2",
            title: "تمرین ورزش صبحگاهی",
            description: "30 دقیقه دویدن و نرمش",
            flag_tuNobat: false,
            isDone: false,
            subtasks: [],
            tags: [{ name: "ورزش", color: "#4690E4" }],
            deadline_date: "1404/06/29",
            hour: "07:00",
            selectedDays: ["ی", "س", "چ"],
            originalIndex: 1
        },
        {
            id: "3",
            title: "تماس با پزشک",
            description: "گرفتن وقت برای چکاپ",
            flag_tuNobat: false,
            isDone: true,
            subtasks: [],
            tags: [{ name: "سلامتی", color: "#DA348D" }],
            deadline_date: "1404/06/28",
            hour: "14:00",
            selectedDays: [],
            originalIndex: 2
        }
    ]);
    const [timers, setTimers] = useState({});

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
        setTimers((prev) => ({
            ...prev,
            [taskId]: { remaining: initialDuration, isRunning: false },
        }));
    };

    const addTask = (newTask) => {
        setTasks((prev) => [
            ...prev,
            {
                id: `${Date.now()}`,
                title: newTask.title,
                description: newTask.description || '',
                deadline_date: newTask.deadline_date,
                flag_tuNobat: newTask.flag_tuNobat || false,
                hour: newTask.hour || '',
                selectedDays: newTask.selectedDays || [],
                subtasks: newTask.subtasks || [],
                tags: newTask.tags || [],
                isDone: false,
                originalIndex: prev.length
            }
        ]);
    };

    const updateTask = (updatedTask) => {
        setTasks((prev) => {
            const otherTasks = prev.filter((task) => task.id !== updatedTask.id);
            if (updatedTask.isDone) {
                return [...otherTasks, updatedTask];
            } else {
                const insertIndex = Math.min(updatedTask.originalIndex || 0, otherTasks.length);
                return [
                    ...otherTasks.slice(0, insertIndex),
                    updatedTask,
                    ...otherTasks.slice(insertIndex)
                ];
            }
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => {
                const updatedTimers = { ...prev };
                Object.keys(updatedTimers).forEach((id) => {
                    const timer = updatedTimers[id];
                    if (timer.isRunning && timer.remaining > 0) {
                        timer.remaining -= 1;
                        if (timer.remaining <= 0) {
                            timer.isRunning = false;
                        }
                    }
                });
                return updatedTimers;
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
                resetTimerForTask,
                addTask,
                updateTask
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;