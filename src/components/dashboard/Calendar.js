import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'jalali-moment';
import { LanguageContext } from '../../context/LanguageContext';
import './Calendar.css';

const Calendar = ({ onDateSelect }) => {
    const { language, t } = useContext(LanguageContext);
    const [currentDate, setCurrentDate] = useState(
        language === 'fa' ? moment().locale('fa') : moment()
    );
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();

    const isJalali = language === 'fa';
    const year = isJalali ? currentDate.jYear() : currentDate.year();
    const month = isJalali ? currentDate.jMonth() : currentDate.month();
    const daysInMonth = isJalali ? currentDate.jDaysInMonth() : currentDate.daysInMonth();
    const firstDayOfMonthMoment = currentDate.clone().startOf(isJalali ? 'jMonth' : 'month');
    const firstDayOfMonth = isJalali ? (firstDayOfMonthMoment.day() + 1) % 7 : firstDayOfMonthMoment.day();

    const today = isJalali ? moment().locale('fa') : moment();
    const todayDay = isJalali ? today.jDate() : today.date();
    const todayMonth = isJalali ? today.jMonth() : today.month();
    const todayYear = isJalali ? today.jYear() : today.year();

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
                ? currentDate.clone().add(1, isJalali ? 'jMonth' : 'month')
                : currentDate.clone().subtract(1, isJalali ? 'jMonth' : 'month')
        );
    };

    const selectDate = (day) => {
        if (!day) return;
        const newSelectedDate = isJalali
            ? moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('fa')
            : moment(`${year}/${month + 1}/${day}`, 'YYYY/MM/DD');
        setSelectedDate(newSelectedDate);
        const formattedDate = isJalali
            ? moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD')
            : newSelectedDate.format('YYYY-MM-DD');
        if (onDateSelect) onDateSelect(formattedDate);
        navigate(`/task-management?date=${formattedDate}`);
    };

    const isSelected = (day) =>
        day &&
        selectedDate &&
        (isJalali ? selectedDate.jDate() : selectedDate.date()) === day &&
        (isJalali ? selectedDate.jMonth() : selectedDate.month()) === month &&
        (isJalali ? selectedDate.jYear() : selectedDate.year()) === year;

    const isToday = (day) =>
        day &&
        todayDay === day &&
        todayMonth === month &&
        todayYear === year;

    const monthName = isJalali ? currentDate.format('jMMMM') : currentDate.format('MMMM');

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button
                    className="nav-button"
                    onClick={() => changeMonth('prev')}
                    aria-label="ماه قبل"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points={isJalali ? "9 18 15 12 9 6" : "15 18 9 12 15 6"} />
                    </svg>
                </button>

                <div className="calendar-title">
                    <span className="month-name">{monthName}</span>
                    <span className="year-name">{year}</span>
                </div>

                <button
                    className="nav-button"
                    onClick={() => changeMonth('next')}
                    aria-label="ماه بعد"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points={isJalali ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
                    </svg>
                </button>
            </div>

            <div className="calendar-grid">
                {t('calendar.days').map((day, index) => (
                    <div key={index} className="calendar-day-header">
                        {day}
                    </div>
                ))}
                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-date${isSelected(day) ? ' selected' : ''}${isToday(day) ? ' today' : ''}${!day ? ' empty' : ''}`}
                        onClick={() => selectDate(day)}
                        role={day ? 'button' : undefined}
                        aria-label={day ? `${day} ${monthName}` : undefined}
                        aria-pressed={isSelected(day) ? true : undefined}
                        tabIndex={day ? 0 : undefined}
                        onKeyDown={(e) => e.key === 'Enter' && selectDate(day)}
                    >
                        {day && <span className="date-number">{day}</span>}
                        {isToday(day) && !isSelected(day) && <span className="today-dot" aria-hidden="true" />}
                    </div>
                ))}
            </div>

            {selectedDate && (
                <div className="selected-date-bar">
                    <span className="selected-date-label">{t('calendar.selectedDate')}</span>
                    <span className="selected-date-value">
                        {selectedDate.format(isJalali ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD')}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Calendar;
