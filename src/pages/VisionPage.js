// pages/VisionPage.js
import React, { useState } from 'react';
import './VisionPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import VisionTaskCard from '../components/VisionTaskCard';
import moment from 'jalali-moment';

function VisionPage() {
    const [selectedYear, setSelectedYear] = useState(1403);
    const [selectedMonth, setSelectedMonth] = useState(2);

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

    const mockCompletedTasks = [
        {
            id: '1',
            title: 'گل دادن به آبها',
            description: 'همه گلدان‌های خانه را آبیاری کردم',
            completed_date: '1403/02/03',
            tags: [
                { name: 'خانه', color: '#4CAF50' },
                { name: 'روزانه', color: '#2196F3' }
            ],
            subtasks: [
                { id: '1', title: 'گلدان اتاق خواب', isDone: true },
                { id: '2', title: 'گلدان پذیرایی', isDone: true }
            ]
        },
        {
            id: '2',
            title: 'ورزش کردن',
            description: 'یک ساعت دویدن در پارک',
            completed_date: '1403/02/03',
            tags: [
                { name: 'سلامتی', color: '#FF9800' }
            ],
            subtasks: []
        },
        {
            id: '3',
            title: 'مطالعه کتاب',
            description: 'خواندن 50 صفحه از کتاب',
            completed_date: '1403/02/05',
            tags: [
                { name: 'مطالعه', color: '#9C27B0' },
                { name: 'شخصی', color: '#607D8B' }
            ],
            subtasks: [
                { id: '1', title: 'فصل اول', isDone: true },
                { id: '2', title: 'فصل دوم', isDone: true },
                { id: '3', title: 'فصل سوم', isDone: true }
            ]
        },
        {
            id: '4',
            title: 'تمیز کردن خانه',
            description: 'نظافت کامل آشپزخانه و حمام',
            completed_date: '1403/02/10',
            tags: [
                { name: 'خانه', color: '#4CAF50' }
            ],
            subtasks: []
        },
        {
            id: '5',
            title: 'جلسه تیمی',
            description: 'شرکت در جلسه هفتگی تیم',
            completed_date: '1403/02/15',
            tags: [
                { name: 'کاری', color: '#F44336' }
            ],
            subtasks: [
                { id: '1', title: 'آماده‌سازی گزارش', isDone: true },
                { id: '2', title: 'ارائه پروژه', isDone: true }
            ]
        }
    ];

    const filteredTasks = mockCompletedTasks.filter(task => {
        const taskDate = moment(task.completed_date, 'jYYYY/jMM/jDD');
        return taskDate.jYear() === selectedYear && taskDate.jMonth() + 1 === selectedMonth;
    });

    const groupedTasks = filteredTasks.reduce((acc, task) => {
        const date = task.completed_date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(task);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
        const dateA = moment(a, 'jYYYY/jMM/jDD');
        const dateB = moment(b, 'jYYYY/jMM/jDD');
        return dateB.diff(dateA);
    });

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

    return (
        <div className="d-flex vision-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="vision-header">
                    <h1 className="vision-title">چشم انداز</h1>
                    <div className="month-selector">
                        <button type="button" className="nav-button" onClick={handlePreviousMonth} aria-label="ماه قبل">
                            ◄
                        </button>
                        <div className="current-month">
            <span className="month-name">
              {persianMonths.find(m => m.value === selectedMonth)?.label}
            </span>
                            <span className="year">{selectedYear}</span>
                        </div>
                        <button type="button" className="nav-button" onClick={handleNextMonth} aria-label="ماه بعد">
                            ►
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
                                        <VisionTaskCard key={task.id} task={task}/>
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