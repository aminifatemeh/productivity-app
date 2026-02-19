import React, { useState, useEffect } from 'react';
import moment from 'jalali-moment';
import './CompactCalendar.css';

const CompactCalendar = ({ selectedDate, onDateSelect, onClose }) => {
    const [currentDate, setCurrentDate] = useState(
        selectedDate
            ? moment(selectedDate, 'YYYY-MM-DD').locale('fa')
            : moment().locale('fa')
    );
    const [internalSelected, setInternalSelected] = useState(
        selectedDate ? moment(selectedDate, 'YYYY-MM-DD').locale('fa') : null
    );

    const year = currentDate.jYear();
    const month = currentDate.jMonth();
    const daysInMonth = currentDate.jDaysInMonth();
    const firstDayOfMonthMoment = currentDate.clone().startOf('jMonth');
    const firstDayOfMonth = (firstDayOfMonthMoment.day() + 1) % 7;

    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    const changeMonth = (direction, e) => {
        // جلوگیری از submit شدن فرم
        e.preventDefault();
        e.stopPropagation();

        setCurrentDate(
            direction === 'next'
                ? currentDate.clone().add(1, 'jMonth')
                : currentDate.clone().subtract(1, 'jMonth')
        );
    };

    const selectDate = (day, e) => {
        if (day) {
            // جلوگیری از submit شدن فرم
            e.preventDefault();
            e.stopPropagation();

            const newSelectedDate = moment(`${year}/${month + 1}/${day}`, 'jYYYY/jMM/jDD').locale('fa');
            setInternalSelected(newSelectedDate);
            const formattedDate = newSelectedDate.locale('en').format('YYYY-MM-DD');
            onDateSelect(formattedDate);
        }
    };

    const handleClose = (e) => {
        // جلوگیری از submit شدن فرم
        e.preventDefault();
        e.stopPropagation();

        if (onClose) {
            onClose();
        }
    };

    const monthName = currentDate.format('jMMMM');
    const persianDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

    return (
        <div className="compact-calendar">
            <div className="compact-calendar-header">
                <button
                    type="button"
                    className="compact-nav-button"
                    onClick={(e) => changeMonth('prev', e)}
                >
                    ←
                </button>
                <div className="compact-calendar-title">{`${monthName} ${year}`}</div>
                <button
                    type="button"
                    className="compact-nav-button"
                    onClick={(e) => changeMonth('next', e)}
                >
                    →
                </button>
            </div>
            <div className="compact-calendar-grid">
                {persianDays.map((day, index) => (
                    <div key={index} className="compact-calendar-day">
                        {day}
                    </div>
                ))}
                {daysArray.map((day, index) => (
                    <div
                        key={index}
                        className={`compact-calendar-date ${
                            day &&
                            internalSelected &&
                            internalSelected.jDate() === day &&
                            internalSelected.jMonth() === month &&
                            internalSelected.jYear() === year
                                ? 'selected'
                                : ''
                        } ${!day ? 'empty' : ''}`}
                        onClick={(e) => selectDate(day, e)}
                    >
                        {day || ''}
                    </div>
                ))}
            </div>
            {onClose && (
                <button
                    type="button"
                    className="compact-calendar-close"
                    onClick={handleClose}
                >
                    بستن
                </button>
            )}
        </div>
    );
};

export default CompactCalendar;