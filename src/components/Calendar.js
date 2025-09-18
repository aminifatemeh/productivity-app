import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'jalali-moment';
import './Calendar.css';

const JalaliCalendar = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(moment().locale('fa'));
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    const year = currentDate.jYear();
    const month = currentDate.jMonth();
    const daysInMonth = currentDate.jDaysInMonth();
    const firstDayOfMonthMoment = currentDate.clone().startOf('jMonth').locale('fa');
    let firstDayOfMonth = firstDayOfMonthMoment.day();
    const offset = 1;
    firstDayOfMonth = (firstDayOfMonth + offset) % 7;

    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    const changeMonth = (direction) => {
        setCurrentDate(
            direction === 'next'
                ? currentDate.clone().add(1, 'jMonth')
                : currentDate.clone().subtract(1, 'jMonth')
        );
    };

    const selectDate = (day) => {
        if (day) {
            const newSelectedDate = moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('fa');
            setSelectedDate(newSelectedDate);
            const formattedDate = newSelectedDate.format('jYYYY/jMM/jDD');
            if (onDateSelect) {
                onDateSelect(formattedDate);
            }
            // هدایت به TaskManagementPage با تاریخ به‌عنوان query parameter
            navigate(`/task-management?date=${formattedDate}`);
        }
    };

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
                        className={`calendar-date ${
                            day &&
                            selectedDate &&
                            selectedDate.jDate() === day &&
                            selectedDate.jMonth() === month &&
                            selectedDate.jYear() === year
                                ? 'selected'
                                : ''
                        } ${!day ? 'empty' : ''}`}
                        onClick={() => selectDate(day)}
                    >
                        {day || ''}
                    </div>
                ))}
            </div>
            {selectedDate && (
                <p className="selected-date">
                    تاریخ انتخاب‌شده: {selectedDate.format('jYYYY/jMM/jDD')}
                </p>
            )}
        </div>
    );
};

export default JalaliCalendar;