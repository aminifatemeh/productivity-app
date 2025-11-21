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

    const tasksInSelectedMonth = tasks
        .filter(task => task.deadline_date)
        .map(task => {
            const date = moment(task.deadline_date, ['YYYY-MM-DD', 'jYYYY/jMM/jDD']);
            if (!date.isValid()) return null;

            const jYear = date.jYear();
            const jMonth = date.jMonth() + 1;
            const jDateStr = date.format('jYYYY/jMM/jDD');

            if (jYear === selectedYear && jMonth === selectedMonth) {
                return { ...task, jalaliDateStr: jDateStr };
            }
            return null;
        })
        .filter(Boolean);

    const groupedTasks = tasksInSelectedMonth.reduce((acc, task) => {
        const key = task.jalaliDateStr;
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
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
        navigate('/task-management', { state: { openEditModalFor: taskId } });
    };

    const currentMonthLabel = persianMonths.find(m => m.value === selectedMonth)?.label || 'نامشخص';

    return (
        <div className="d-flex vision-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="vision-header">
                    <h1 className="vision-title">چشم‌انداز</h1>
                    <div className="month-selector">
                        <button type="button" className="nav-button" onClick={handlePreviousMonth}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18L9 12L15 6" />
                            </svg>
                        </button>

                        <div className="current-month">
                            <span className="month-name">{currentMonthLabel}</span>
                            <span className="year">{selectedYear}</span>
                        </div>

                        <button type="button" className="nav-button" onClick={handleNextMonth}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18L15 12L9 6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="vision-content">
                    {tasks.length === 0 ? (
                        <div className="empty-message">در حال بارگذاری تسک‌ها...</div>
                    ) : sortedDates.length === 0 ? (
                        <div className="empty-message">
                            هیچ تسکی در {currentMonthLabel} {selectedYear} وجود ندارد
                        </div>
                    ) : (
                        sortedDates.map(date => (
                            <div key={date} className="date-group">
                                <h2 className="date-header">{date}</h2>
                                <div className="row gy-4">
                                    {groupedTasks[date].map(task => (
                                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={task.id}>
                                            <VisionTaskCard
                                                task={{
                                                    ...task,
                                                    deadline_date: date,
                                                }}
                                                onEdit={() => handleEditTask(task.id)}
                                            />
                                        </div>
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