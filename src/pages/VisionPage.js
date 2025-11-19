// pages/VisionPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './VisionPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import VisionTaskCard from '../components/VisionTaskCard';
import { TaskContext } from '../components/TaskContext';
import moment from 'jalali-moment';

function VisionPage() {
    const { tasks } = useContext(TaskContext);
    const navigate = useNavigate();

    const currentJalali = moment().locale('fa');
    const [selectedYear, setSelectedYear] = useState(parseInt(currentJalali.format('jYYYY')));
    const [selectedMonth, setSelectedMonth] = useState(parseInt(currentJalali.format('jMM')));

    const persianMonths = [
        { value: 1, label: 'فروردین' },
        { value: 2, label: 'اردیبهشت' },
        { value: 3, label: 'خرداد' },
        { value: 4, label: 'تیر' },
        { value: 5, label: 'مرداد' },
        { value: 6, label: 'شهریور' },
        { value: 7, label: 'مهر' },
        { value: 8, label: 'آبان' },
        { value: 9, label: 'آذر' },
        { value: 10, label: 'دی' },
        { value: 11, label: 'بهمن' },
        { value: 12, label: 'اسفند' },
    ];

    // تسک‌های انجام شده
    const completedTasks = tasks
        .filter(task => task.isDone)
        .map(task => ({
            ...task,
            completed_date: task.completed_date || task.deadline_date || moment().format('jYYYY/jMM/jDD'),
        }));

    // فیلتر بر اساس سال و ماه
    const filteredTasks = completedTasks.filter(task => {
        const taskDate = moment(task.completed_date, 'jYYYY/jMM/jDD');
        return taskDate.isValid() &&
            taskDate.jYear() === selectedYear &&
            (taskDate.jMonth() + 1) === selectedMonth;
    });

    // گروه‌بندی بر اساس تاریخ
    const groupedTasks = filteredTasks.reduce((acc, task) => {
        const dateKey = moment(task.completed_date, 'jYYYY/jMM/jDD').format('jYYYY/jMM/jDD');
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort((a, b) =>
        moment(b, 'jYYYY/jMM/jDD').diff(moment(a, 'jYYYY/jMM/jDD'))
    );

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

    const handleEditTask = (taskId) => {
        navigate('/task-management', {
            state: { openEditModalFor: taskId }
        });
    };

    return (
        <div className="d-flex vision-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="vision-header">
                    <h1 className="vision-title">چشم انداز</h1>
                    <div className="month-selector">
                        <button type="button" className="nav-button" onClick={handlePreviousMonth}>
                            Previous
                        </button>
                        <div className="current-month">
                            <span className="month-name">
                                {persianMonths.find(m => m.value === selectedMonth)?.label}
                            </span>
                            <span className="year">{selectedYear}</span>
                        </div>
                        <button type="button" className="nav-button" onClick={handleNextMonth}>
                            Next
                        </button>
                    </div>
                </div>

                <div className="vision-content">
                    {sortedDates.length === 0 ? (
                        <div className="empty-message">
                            هیچ تسک تکمیل شده‌ای در این ماه یافت نشد
                        </div>
                    ) : (
                        sortedDates.map(date => (
                            <div key={date} className="date-group">
                                <h2 className="date-header">{date}</h2>
                                <div className="tasks-grid">
                                    {groupedTasks[date].map(task => (
                                        <VisionTaskCard
                                            key={task.id}
                                            task={task}
                                            onEdit={() => handleEditTask(task.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisionPage;