// pages/VisionPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VisionPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import { tasksAPI } from '../api/apiService';
import moment from 'jalali-moment';

function VisionPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const currentJalali = moment().locale('fa');
    const [selectedYear, setSelectedYear] = useState(parseInt(currentJalali.format('jYYYY')));
    const [selectedMonth, setSelectedMonth] = useState(parseInt(currentJalali.format('jMM')));

    const persianMonths = [
        { value: 1, label: 'فروردین' }, { value: 2, label: 'اردیبهشت' },
        { value: 3, label: 'خرداد' }, { value: 4, label: 'تیر' },
        { value: 5, label: 'مرداد' }, { value: 6, label: 'شهریور' },
        { value: 7, label: 'مهر' }, { value: 8, label: 'آبان' },
        { value: 9, label: 'آذر' }, { value: 10, label: 'دی' },
        { value: 11, label: 'بهمن' }, { value: 12, label: 'اسفند' },
    ];

    // Normalize task data from different endpoints
    const normalizeTask = (task) => {
        return {
            id: task.id.toString(),
            title: task.title || 'بدون عنوان',
            description: task.description || '',
            deadline_date: task.deadline_date || null,
            hour: task.deadline_time || task.hour || '',
            done_date: task.done_date || null,
            isDone: !!task.done_date,
        };
    };

    // Fetch tasks from all three endpoints
    const fetchAllTasks = async () => {
        try {
            setLoading(true);

            const [khakKhordeData, rumizData, nobateshMisheData] = await Promise.all([
                tasksAPI.getKhakKhordeTasks(),
                tasksAPI.getRumizTasks(),
                tasksAPI.getNobateshMisheTasks()
            ]);

            let allTasks = [];

            // Process Khak Khorde tasks
            if (Array.isArray(khakKhordeData)) {
                allTasks.push(...khakKhordeData);
            } else if (khakKhordeData && typeof khakKhordeData === 'object') {
                const khakTasks = khakKhordeData.tasks || khakKhordeData.completed_tasks || [];
                allTasks.push(...khakTasks);
            }

            // Process Rumiz tasks
            if (Array.isArray(rumizData)) {
                allTasks.push(...rumizData);
            } else if (rumizData && typeof rumizData === 'object') {
                const rumizTasks = [
                    ...(rumizData.completed_tasks || []),
                    ...(rumizData.not_completed_tasks || [])
                ];
                allTasks.push(...rumizTasks);
            }

            // Process Nobatesh Mishe tasks
            if (Array.isArray(nobateshMisheData)) {
                allTasks.push(...nobateshMisheData);
            } else if (nobateshMisheData && typeof nobateshMisheData === 'object') {
                const nobateshTasks = nobateshMisheData.tasks || nobateshMisheData.not_completed_tasks || [];
                allTasks.push(...nobateshTasks);
            }

            // Normalize and deduplicate tasks by id
            const normalizedTasks = allTasks.map(task => normalizeTask(task));
            const uniqueTasks = Array.from(
                new Map(normalizedTasks.map(task => [task.id, task])).values()
            );

            setTasks(uniqueTasks);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const daysInMonth = moment.jDaysInMonth(selectedYear, selectedMonth - 1);

    // گروه‌بندی تسک‌ها بر اساس تاریخ
    const tasksByDate = tasks
        .filter(task => task.deadline_date)
        .reduce((acc, task) => {
            const date = moment(task.deadline_date, ['YYYY-MM-DD', 'jYYYY/jMM/jDD']);
            if (!date.isValid()) return acc;

            const jYear = date.jYear();
            const jMonth = date.jMonth() + 1;
            const jDay = date.jDate();

            if (jYear === selectedYear && jMonth === selectedMonth) {
                const key = `${jYear}-${jMonth}-${jDay}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(task);
            }
            return acc;
        }, {});

    const handlePreviousMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const handleTaskClick = (taskId) => {
        navigate('/task-management', { state: { openEditModalFor: taskId } });
    };

    const currentMonthLabel = persianMonths.find(m => m.value === selectedMonth)?.label || '';

    const funnyEmptyMessages = [
        "امروز رو استراحتی! 😎",
        "روز خالی و قشنگ! 🌿",
        "هیچ برنامه‌ای؟ عالیه! ☀️",
        "امروز مال توئه! 🎉",
        "آرامش مطلق... 🧘‍♂️",
        "روز آزاد! ✈️",
        "خوش به حالت! 😴",
        "وقت استراحت! 🛋️",
        "روز بی‌دغدغه! 🎈",
        "لذت ببر! ☕"
    ];

    const getRandomFunnyMessage = () => {
        return funnyEmptyMessages[Math.floor(Math.random() * funnyEmptyMessages.length)];
    };

    // محاسبه گرادیانت برای هر کارت (از آبی روشن به سبز)
    const getCardGradient = (index, total) => {
        const ratio = index / total;

        // رنگ شروع (آبی روشن): #64B5F6
        const startR = 100, startG = 181, startB = 246;
        // رنگ پایان (سبز): #66BB6A
        const endR = 102, endG = 187, endB = 106;

        const r = Math.round(startR + (endR - startR) * ratio);
        const g = Math.round(startG + (endG - startG) * ratio);
        const b = Math.round(startB + (endB - startB) * ratio);

        const r2 = Math.round(r + 15);
        const g2 = Math.round(g + 15);
        const b2 = Math.round(b + 15);

        return `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), rgb(${r2}, ${g2}, ${b2}))`;
    };

    // محاسبه نام روز هفته
    const getDayName = (day) => {
        const date = moment(`${selectedYear}/${selectedMonth}/${day}`, 'jYYYY/jM/jD');
        const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
        return dayNames[date.day()];
    };

    return (
        <div className="d-flex vision-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content">
                <div className="vision-header">
                    <h1 className="vision-title">چشم‌انداز ماهانه</h1>
                    <div className="month-selector">
                        <button className="nav-button" onClick={handlePreviousMonth}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18L9 12L15 6" />
                            </svg>
                        </button>
                        <div className="current-month">
                            <span className="month-name">{currentMonthLabel}</span>
                            <span className="year">{selectedYear}</span>
                        </div>
                        <button className="nav-button" onClick={handleNextMonth}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18L15 12L9 6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-message-full">
                        <div className="loading-spinner"></div>
                        <p>در حال بارگذاری تسک‌ها...</p>
                    </div>
                ) : (
                    <div className="calendar-grid">
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateKey = `${selectedYear}-${selectedMonth}-${day}`;
                            const dayTasks = tasksByDate[dateKey] || [];
                            const dayName = getDayName(day);
                            const gradient = getCardGradient(i, daysInMonth);

                            return (
                                <div key={day} className="day-card" style={{ '--card-gradient': gradient }}>
                                    <div className="day-header" style={{ background: gradient }}>
                                        <div className="day-info">
                                            <span className="day-number">{day}</span>
                                            <span className="day-name">{dayName}</span>
                                        </div>
                                        <span className="month-label">{currentMonthLabel}</span>
                                    </div>
                                    <div className="tasks-list">
                                        {dayTasks.length > 0 ? (
                                            dayTasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className="task-item"
                                                    onClick={() => handleTaskClick(task.id)}
                                                >
                                                    <span className="task-title">{task.title || 'بدون عنوان'}</span>
                                                    {task.hour && (
                                                        <span className="task-time">⏰ {task.hour}</span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="empty-day">
                                                {getRandomFunnyMessage()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VisionPage;