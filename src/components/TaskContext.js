import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const [initialDuration, setInitialDuration] = useState((parseInt(localStorage.getItem("timerDuration")) || 5) * 60);

    const getCurrentUserId = () => localStorage.getItem('userId') || 'offline_user';

    const fetchTasks = () => {
        const userId = getCurrentUserId();
        let storedTasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');

        if (storedTasks.length === 0) {
            storedTasks = [
                {
                    id: Date.now().toString() + '1',
                    title: 'آماده‌سازی اسلایدهای ارائه',
                    description: 'اسلایدهای پاورپوینت برای ارائه درس هوش مصنوعی (حداقل 10 اسلاید شامل مقدمه، روش‌ها، و نتیجه‌گیری)',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: '1', title: 'جمع‌آوری منابع تحقیقاتی', isDone: false },
                        { id: '2', title: 'طراحی نمودارها و جداول', isDone: false },
                        { id: '3', title: 'نوشتن متن اسلایدها', isDone: false },
                        { id: '4', title: 'تمرین ارائه', isDone: false },
                    ],
                    tags: [
                        { name: 'دانشگاه', color: '#FF5733', isDefault: true },
                        { name: 'پروژه', color: '#33C4FF', isDefault: true },
                        { name: 'فوری', color: '#FF33A1', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '14:00',
                    selectedDays: [],
                    originalIndex: 0,
                },
                {
                    id: Date.now().toString() + '2',
                    title: 'خرید مواد غذایی',
                    description: 'خرید اقلام ضروری برای هفته (شامل لبنیات، میوه، سبزیجات، و مواد پروتئینی)',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: '1', title: 'تهیه لیست خرید', isDone: false },
                        { id: '2', title: 'بازدید از سوپرمارکت', isDone: false },
                        { id: '3', title: 'بررسی تاریخ انقضای محصولات', isDone: false },
                    ],
                    tags: [
                        { name: 'خرید', color: '#28A745', isDefault: true },
                        { name: 'خانه', color: '#FFC107', isDefault: true },
                        { name: 'ضروری', color: '#DC3545', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '18:00',
                    selectedDays: ['Saturday'],
                    originalIndex: 1,
                },
                {
                    id: Date.now().toString() + '3',
                    title: 'هماهنگی جلسه تیمی',
                    description: 'تنظیم جلسه با تیم پروژه برای بررسی پیشرفت پروژه اپلیکیشن',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: '1', title: 'رزرو اتاق جلسه', isDone: false },
                        { id: '2', title: 'ارسال دعوت‌نامه به اعضا', isDone: false },
                        { id: '3', title: 'آماده‌سازی دستور جلسه', isDone: false },
                    ],
                    tags: [
                        { name: 'کار', color: '#007BFF', isDefault: true },
                        { name: 'جلسه', color: '#6F42C1', isDefault: true },
                        { name: 'هماهنگی', color: '#FD7E14', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '10:00',
                    selectedDays: [],
                    originalIndex: 2,
                },
                {
                    id: Date.now().toString() + '4',
                    title: 'تمرین ورزشی',
                    description: '30 دقیقه ورزش شامل دویدن و تمرینات کششی',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: '1', title: 'گرم کردن (5 دقیقه)', isDone: false },
                        { id: '2', title: 'دویدن (20 دقیقه)', isDone: false },
                        { id: '3', title: 'تمرینات کششی (5 دقیقه)', isDone: false },
                    ],
                    tags: [
                        { name: 'ورزش', color: '#20C997', isDefault: true },
                        { name: 'سلامت', color: '#17A2B8', isDefault: true },
                        { name: 'روتین', color: '#E83E8C', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '07:00',
                    selectedDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    originalIndex: 3,
                },
            ];
            localStorage.setItem(`tasks_${userId}`, JSON.stringify(storedTasks));
        }

        const fetchedTasks = storedTasks.map((task, index) => ({
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
    };

    const editTask = (task) => {
        const userId = getCurrentUserId();
        const storedTasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');
        const updatedTasks = storedTasks.map((t) => (t.id === task.id ? task : t));
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        return { success: true, task };
    };

    const deleteTask = (taskId) => {
        const userId = getCurrentUserId();
        const storedTasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');
        const updatedTasks = storedTasks.filter((task) => task.id !== taskId);
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        setTimers((prevTimers) => {
            const updatedTimers = { ...prevTimers };
            delete updatedTimers[taskId];
            return updatedTimers;
        });
        return { success: true };
    };

    const toggleTask = (taskId) => {
        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask) {
            return { success: false, error: 'تسک یافت نشد' };
        }
        const done = !currentTask.isDone;
        const updatedTask = { ...currentTask, isDone: done };
        return editTask(updatedTask);
    };

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
            const timer = prev[taskId] || { remaining: initialDuration, isRunning: false };
            return { ...prev, [taskId]: { ...timer, remaining: initialDuration, isRunning: false } };
        });
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

    // ✅ FIX: تایمر اصلاح‌شده
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => {
                const updatedTimers = { ...prev };
                let hasChanges = false;

                Object.keys(updatedTimers).forEach((id) => {
                    const timer = updatedTimers[id];
                    if (timer.isRunning && timer.remaining > 0) {
                        updatedTimers[id] = {
                            ...timer,
                            remaining: timer.remaining - 1
                        };
                        hasChanges = true;
                    } else if (timer.remaining <= 0 && timer.isRunning) {
                        updatedTimers[id] = {
                            ...timer,
                            isRunning: false
                        };
                        hasChanges = true;
                    }
                });

                return hasChanges ? updatedTimers : prev;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []); // ✅ dependency array خالی

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
                editTask,
                deleteTask,
                toggleTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;