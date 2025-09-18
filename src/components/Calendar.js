import React, { useState } from 'react';
import moment from 'jalali-moment';
import './Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(moment().locale('fa')); // تاریخ شمسی کنونی
    const [selectedDate, setSelectedDate] = useState(null);

    // گرفتن اطلاعات ماه جاری
    const year = currentDate.jYear();
    const month = currentDate.jMonth();
    const daysInMonth = currentDate.jDaysInMonth();
    const firstDayOfMonthMoment = currentDate.clone().startOf('jMonth').locale('fa');
    let firstDayOfMonth = firstDayOfMonthMoment.day();
    const offset = 1; // تنظیم برای شروع هفته از شنبه
    firstDayOfMonth = (firstDayOfMonth + offset) % 7;

    // تولید آرایه روزهای ماه
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    // تغییر ماه
    const changeMonth = (direction) => {
        setCurrentDate(
            direction === 'next'
                ? currentDate.clone().add(1, 'jMonth')
                : currentDate.clone().subtract(1, 'jMonth')
        );
    };

    // انتخاب روز
    const selectDate = (day) => {
        if (day) {
            setSelectedDate(
                moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('fa')
            );
        }
    };

    // نام ماه
    const monthName = currentDate.format('jMMMM');

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-title">{`${monthName} ${year}`}</div>
                <div className="calendar-nav">
                    <button className="nav-button prev" onClick={() => changeMonth('prev')}>
                        قبلی
                    </button>
                    <button className="nav-button next" onClick={() => changeMonth('next')}>
                        بعدی
                    </button>
                </div>
            </div>
            <div className="calendar-grid">
                <div className="calendar-day">ش</div>
                <div className="calendar-day">ی</div>
                <div className="calendar-day">د</div>
                <div className="calendar-day">س</div>
                <div className="calendar-day">چ</div>
                <div className="calendar-day">پ</div>
                <div className="calendar-day">ج</div>

                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-date ${day && selectedDate && selectedDate.jDate() === day && selectedDate.jMonth() === month && selectedDate.jYear() === year ? 'selected' : ''} ${!day ? 'empty' : ''}`}
                        onClick={() => selectDate(day)}
                    >
                        {day || ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;