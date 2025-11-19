import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [timers, setTimers] = useState({});
    const [initialDuration, setInitialDuration] = useState(
        (parseInt(localStorage.getItem("timerDuration")) || 5) * 60
    );

    const getCurrentUserId = () => localStorage.getItem('userId') || 'offline_user';

    // تابع تولید id منحصر به فرد و همیشه string
    const generateUniqueId = () => {
        return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    };

    const fetchTasks = () => {
        const userId = getCurrentUserId();
        let storedTasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');

        // اگر هیچ تسکی وجود نداشت → تسک‌های پیش‌فرض بساز
        if (storedTasks.length === 0) {
            const baseTime = Date.now();
            storedTasks = [
                {
                    id: `${baseTime}_default_1`,
                    title: 'آماده‌سازی اسلایدهای ارائه',
                    description: 'اسلایدهای پاورپوینت برای ارائه درس هوش مصنوعی (حداقل 10 اسلاید شامل مقدمه، روش‌ها، و نتیجه‌گیری)',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: 'sub1', title: 'جمع‌آوری منابع تحقیقاتی', isDone: false },
                        { id: 'sub2', title: 'طراحی نمودارها و جداول', isDone: false },
                        { id: 'sub3', title: 'نوشتن متن اسلایدها', isDone: false },
                        { id: 'sub4', title: 'تمرین ارائه', isDone: false },
                    ],
                    tags: [
                        { name: 'دانشگاه', color: '#FF5733', isDefault: true },
                        { name: 'پروژه', color: '#33C4FF', isDefault: true },
                        { name: 'فوری', color: '#FF33A1', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '14:00',
                    selectedDays: [],
                },
                {
                    id: `${baseTime}_default_2`,
                    title: 'خرید مواد غذایی',
                    description: 'خرید اقلام ضروری برای هفته (شامل لبنیات، میوه، سبزیجات، و مواد پروتئینی)',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: 'sub1', title: 'تهیه لیست خرید', isDone: false },
                        { id: 'sub2', title: 'بازدید از سوپرمارکت', isDone: false },
                        { id: 'sub3', title: 'بررسی تاریخ انقضای محصولات', isDone: false },
                    ],
                    tags: [
                        { name: 'خرید', color: '#28A745', isDefault: true },
                        { name: 'خانه', color: '#FFC107', isDefault: true },
                        { name: 'ضروری', color: '#DC3545', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '18:00',
                    selectedDays: ['Saturday'],
                },
                {
                    id: `${baseTime}_default_3`,
                    title: 'هماهنگی جلسه تیمی',
                    description: 'تنظیم جلسه با تیم پروژه برای بررسی پیشرفت پروژه اپلیکیشن',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: 'sub1', title: 'رزرو اتاق جلسه', isDone: false },
                        { id: 'sub2', title: 'ارسال دعوت‌نامه به اعضا', isDone: false },
                        { id: 'sub3', title: 'آماده‌سازی دستور جلسه', isDone: false },
                    ],
                    tags: [
                        { name: 'کار', color: '#007BFF', isDefault: true },
                        { name: 'جلسه', color: '#6F42C1', isDefault: true },
                        { name: 'هماهنگی', color: '#FD7E14', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '10:00',
                    selectedDays: [],
                },
                {
                    id: `${baseTime}_default_4`,
                    title: 'تمرین ورزشی',
                    description: '30 دقیقه ورزش شامل دویدن و تمرینات کششی',
                    flag_tuNobat: false,
                    isDone: false,
                    subtasks: [
                        { id: 'sub1', title: 'گرم کردن (5 دقیقه)', isDone: false },
                        { id: 'sub2', title: 'دویدن (20 دقیقه)', isDone: false },
                        { id: 'sub3', title: 'تمرینات کششی (5 دقیقه)', isDone: false },
                    ],
                    tags: [
                        { name: 'ورزش', color: '#20C997', isDefault: true },
                        { name: 'سلامت', color: '#17A2B8', isDefault: true },
                        { name: 'روتین', color: '#E83E8C', isDefault: true },
                    ],
                    deadline_date: '2025-09-01',
                    hour: '07:00',
                    selectedDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                },
            ];
            localStorage.setItem(`tasks_${userId}`, JSON.stringify(storedTasks));
        }

        // تبدیل امن و یکسان‌سازی داده‌ها
        const fetchedTasks = storedTasks.map((task, index) => {
            const safeId = task.id && typeof task.id === 'string' && task.id.trim() !== ''
                ? task.id
                : generateUniqueId();

            return {
                id: safeId,
                title: task.title || 'بدون عنوان',
                description: task.description || '',
                flag_tuNobat: task.flag_tuNobat ?? false,
                isDone: task.isDone ?? false,
                subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(sub => ({
                    ...sub,
                    id: sub.id || generateUniqueId()
                })) : [],
                tags: Array.isArray(task.tags) ? task.tags : [],
                deadline_date: task.deadline_date || '',
                hour: task.hour || '',
                selectedDays: Array.isArray(task.selectedDays) ? task.selectedDays : [],
                originalIndex: typeof task.originalIndex === 'number' ? task.originalIndex : index,
            };
        });

        setTasks(fetchedTasks);

        // مقداردهی اولیه تایمرها
        setTimers(prev => {
            const newTimers = { ...prev };
            fetchedTasks.forEach(task => {
                if (!newTimers[task.id]) {
                    newTimers[task.id] = { remaining: initialDuration, isRunning: false };
                }
            });
            return newTimers;
        });
    };

    // ویرایش تسک
    const editTask = (updatedTask) => {
        const userId = getCurrentUserId();
        const storedTasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');
        const newTasks = storedTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(newTasks));
        setTasks(newTasks);
        return { success: true, task: updatedTask };
    };

    // حذف تسک
    const deleteTask = (taskId) => {
        const userId = getCurrentUserId();
        const storedTasks = JSON.parse(localStorage.getItem(`tasks_${userId}`) || '[]');
        const newTasks = storedTasks.filter(t => t.id !== taskId);
        localStorage.setItem(`tasks_${userId}`, JSON.stringify(newTasks));
        setTasks(newTasks);

        setTimers(prev => {
            const { [taskId]: _, ...rest } = prev;
            return rest;
        });

        return { success: true };
    };

    // تغییر وضعیت انجام/انجام نشده
    const toggleTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return { success: false, error: 'تسک یافت نشد' };
        return editTask({ ...task, isDone: !task.isDone });
    };

    // کنترل تایمر
    const startTimer = (taskId) => {
        setTimers(prev => ({
            ...prev,
            [taskId]: { ...prev[taskId], isRunning: true }
        }));
    };

    const stopTimer = (taskId) => {
        setTimers(prev => ({
            ...prev,
            [taskId]: { ...prev[taskId], isRunning: false }
        }));
    };

    const resetTimerForTask = (taskId) => {
        setTimers(prev => ({
            ...prev,
            [taskId]: { remaining: initialDuration, isRunning: false }
        }));
    };

    // لود اولیه
    useEffect(() => {
        fetchTasks();
    }, []);

    // همگام‌سازی با تغییر timerDuration در localStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
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
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // تایمر اصلی (هر ثانیه)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const updated = { ...prev };
                let changed = false;

                Object.keys(updated).forEach(id => {
                    const t = updated[id];
                    if (t.isRunning && t.remaining > 0) {
                        t.remaining -= 1;
                        changed = true;
                    } else if (t.isRunning && t.remaining <= 0) {
                        t.isRunning = false;
                        changed = true;
                    }
                });

                return changed ? updated : prev;
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
                editTask,
                deleteTask,
                toggleTask,
                generateUniqueId, // در صورت نیاز در کامپوننت‌های دیگر
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export default TaskProvider;