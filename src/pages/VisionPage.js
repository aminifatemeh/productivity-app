// pages/VisionPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './VisionPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import { TaskContext } from '../components/TaskContext';
import moment from 'jalali-moment';

function VisionPage() {
    const { tasks } = useContext(TaskContext);
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

    // تعداد روزهای ماه انتخابی
    const daysInMonth = moment.jDaysInMonth(selectedYear, selectedMonth - 1);

    // جمع‌آوری تسک‌های ماه انتخابی
    const tasksByDate = {};

    tasks
        .filter(task => task.deadline_date)
        .forEach(task => {
            const date = moment(task.deadline_date, ['YYYY-MM-DD', 'jYYYY/jMM/jDD']);
            if (!date.isValid()) return;

            const jYear = date.jYear();
            const jMonth = date.jMonth() + 1;
            const jDay = date.jDate();
            const key = `${jYear}-${jMonth}-${jDay}`;

            if (jYear === selectedYear && jMonth === selectedMonth) {
                if (!tasksByDate[key]) tasksByDate[key] = [];
                tasksByDate[key].push(task);
            }
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
        "خوش به حالت! 😴"
    ];

    const getRandomFunnyMessage = () => {
        return funnyEmptyMessages[Math.floor(Math.random() * funnyEmptyMessages.length)];
    };

    return (
      <div className="d-flex vision-page" dir="rtl">
        <SidebarMenu />
        <div className="main-content">
          <div className="vision-header">
            <h1 className="vision-title">چشم‌انداز</h1>
            <div className="month-selector">
              <button className="nav-button" onClick={handlePreviousMonth}>
                <img src="/assets/icons/right-arrow.svg" alt="arrow" />
              </button>
              <div className="current-month">
                <span className="month-name">{currentMonthLabel}</span>
                <span className="year"> {selectedYear}</span>
              </div>
              <button className="nav-button" onClick={handleNextMonth}>
                <img src="/assets/icons/left-arrow.svg" alt="arrow" />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateKey = `${selectedYear}-${selectedMonth}-${day}`;
              const dayTasks = tasksByDate[dateKey] || [];
              const jalaliDateStr = `${selectedYear}/${String(
                selectedMonth
              ).padStart(2, "0")}/${String(day).padStart(2, "0")}`;

              return (
                <div key={day} className="day-card">
                  <div className="day-header">
                    <span className="day-number">{day}</span>
                    <span className="day-label">{currentMonthLabel}</span>
                  </div>
                  <div className="tasks-list">
                    {dayTasks.length > 0 ? (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="task-item"
                          onClick={() => handleTaskClick(task.id)}
                        >
                          {task.title || "بدون عنوان"}
                        </div>
                      ))
                    ) : (
                      <div className="empty-day">{getRandomFunnyMessage()}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {tasks.length === 0 && (
            <div className="empty-message full">در حال بارگذاری تسک‌ها...</div>
          )}
        </div>
      </div>
    );
}

export default VisionPage;