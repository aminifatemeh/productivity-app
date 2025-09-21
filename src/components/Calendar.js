import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'jalali-moment';
import { LanguageContext } from '../context/LanguageContext';
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
    const firstDayOfMonth = isJalali ? (firstDayOfMonthMoment.day() + 1) % 7 : firstDayOfMonthMoment.day(); // حذف آفست اضافی و اصلاح محاسبه روز اول

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
        if (day) {
            const newSelectedDate = isJalali
                ? moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('fa')
                : moment(`${year}/${month + 1}/${day}`, 'YYYY/MM/DD');
            setSelectedDate(newSelectedDate);
            // تبدیل تاریخ جلالی به میلادی با فرمت YYYY-MM-DD
            const formattedDate = isJalali
                ? moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('en').format('YYYY-MM-DD')
                : newSelectedDate.format('YYYY-MM-DD');
            console.log('Selected Date:', formattedDate); // برای دیباگ
            if (onDateSelect) {
                onDateSelect(formattedDate);
            }
            navigate(`/task-management?date=${formattedDate}`);
        }
    };

    const monthName = isJalali
        ? currentDate.format('jMMMM')
        : currentDate.format('MMMM');

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-title">{`${monthName} ${year}`}</div>
                <div className="calendar-nav">
                    <button className="nav-button prev" onClick={() => changeMonth('prev')}>
                        {t('calendar.prev')}
                    </button>
                    <button className="nav-button next" onClick={() => changeMonth('next')}>
                        {t('calendar.next')}
                    </button>
                </div>
            </div>
            <div className="calendar-grid">
                {t('calendar.days').map((day, index) => (
                    <div key={index} className="calendar-day">
                        {day}
                    </div>
                ))}
                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-date ${
                            day &&
                            selectedDate &&
                            (isJalali ? selectedDate.jDate() : selectedDate.date()) === day &&
                            (isJalali ? selectedDate.jMonth() : selectedDate.month()) === month &&
                            (isJalali ? selectedDate.jYear() : selectedDate.year()) === year
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
                    {t('calendar.selectedDate')}: {selectedDate.format(isJalali ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD')}
                </p>
            )}
        </div>
    );
};

export default Calendar;