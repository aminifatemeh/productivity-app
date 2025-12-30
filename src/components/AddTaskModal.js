// components/AddTaskModal.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import './AddTaskModal.scss';
import moment from 'jalali-moment';
import { TaskContext } from './TaskContext';
import CompactCalendar from './CompactClendar';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, initialTask, selectedDate }) => {
    const { addTask, editTask } = useContext(TaskContext);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [subtaskCount, setSubtaskCount] = useState(0);
    const [subtasks, setSubtasks] = useState([]);
    const [isRoutine, setIsRoutine] = useState(false);
    const [isInNobat, setIsInNobat] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isDoneAlready, setIsDoneAlready] = useState(false);
    const [doneDate, setDoneDate] = useState('');
    const [showDoneDateCalendar, setShowDoneDateCalendar] = useState(false);
    const modalRef = useRef(null);

    // Fixed categories - cannot be modified by user
    const [categories, setCategories] = useState([
        { id: 1, name: 'درس', color: '#4690E4', selected: false },
        { id: 2, name: 'کار', color: '#DA348D', selected: false },
        { id: 3, name: 'کلاس', color: '#FFA500', selected: false },
        { id: 4, name: 'ورزش', color: '#34AA7B', selected: false },
        { id: 5, name: 'سلامتی', color: '#FF6B6B', selected: false },
    ]);

    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [errors, setErrors] = useState({ name: '', dueDate: '', doneDate: '', form: '' });

    // Mapping روزهای فارسی به اعداد 1-7
    const dayMapping = {
        'شنبه': 1,
        'یکشنبه': 2,
        'دوشنبه': 3,
        'سه‌شنبه': 4,
        'چهارشنبه': 5,
        'پنج‌شنبه': 6,
        'جمعه': 7
    };

    const reverseDayMapping = {
        1: 'شنبه',
        2: 'یکشنبه',
        3: 'دوشنبه',
        4: 'سه‌شنبه',
        5: 'چهارشنبه',
        6: 'پنج‌شنبه',
        7: 'جمعه'
    };

    /* ------------------- پر کردن فرم برای ویرایش ------------------- */
    useEffect(() => {
        if (initialTask) {
            console.log('Initial task در مودال:', initialTask);

            setName(initialTask.title || '');
            setDescription(initialTask.description || '');
            setTime(initialTask.deadline_time || '');

            // تبدیل تاریخ deadline به فرمت میلادی
            if (initialTask.deadline_date) {
                console.log('deadline_date دریافتی:', initialTask.deadline_date);
                // تاریخ از سرور همیشه میلادی است (YYYY-MM-DD)
                setDueDate(initialTask.deadline_date);
            } else {
                setDueDate('');
            }

            setIsInNobat(!!initialTask.flag_tuNobat);
            setIsRoutine(!!initialTask.is_routine_active);

            // تبدیل repeat_days از اعداد به نام فارسی روزها
            if (initialTask.repeat_days && Array.isArray(initialTask.repeat_days)) {
                console.log('repeat_days:', initialTask.repeat_days);
                const days = initialTask.repeat_days
                    .map(num => reverseDayMapping[num])
                    .filter(Boolean);
                console.log('Selected days:', days);
                setSelectedDays(days);
            } else {
                setSelectedDays([]);
            }

            // ساب‌تسک‌ها
            const serverSubtasks = (initialTask.subtasks || [])
                .filter(sub => sub.id && Number.isInteger(sub.id))
                .map(sub => ({
                    id: sub.id,
                    title: sub.title || '',
                }));

            setSubtasks(serverSubtasks);
            setSubtaskCount(serverSubtasks.length);

            // دسته‌بندی‌ها - مارک کردن دسته‌های انتخاب‌شده
            if (initialTask.categories && Array.isArray(initialTask.categories)) {
                console.log('categories:', initialTask.categories);
                setCategories(prev => prev.map(cat => ({
                    ...cat,
                    selected: initialTask.categories.some(c =>
                        c.id === cat.id || c.name === cat.name
                    )
                })));
            }

            // اگر تسک قبلاً انجام شده
            if (initialTask.done_date) {
                setIsDoneAlready(true);
                const doneDateMoment = moment(initialTask.done_date, 'YYYY-MM-DD');
                if (doneDateMoment.isValid()) {
                    setDoneDate(doneDateMoment.format('YYYY-MM-DD'));
                }
            }

            if (initialTask.duration) {
                setDuration(initialTask.duration);
            }

        } else if (selectedDate) {
            // حالت افزودن تسک جدید با تاریخ از کالندر
            const date = moment(selectedDate, ['YYYY-MM-DD', 'jYYYY/jMM/jDD']);
            if (date.isValid()) {
                setDueDate(date.format('YYYY-MM-DD'));
            } else {
                setDueDate('');
            }
            resetFormFields();
        } else {
            resetFormFields();
        }
    }, [initialTask, selectedDate]);

    const resetFormFields = () => {
        setSubtasks([]);
        setSubtaskCount(0);
        setIsRoutine(false);
        setIsInNobat(false);
        setSelectedDays([]);
        setIsDoneAlready(false);
        setDoneDate('');
        setDuration('');
    };

    /* ------------------- ساب‌تسک‌ها ------------------- */
    const handleSubtaskChange = (index, value) => {
        setSubtasks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], title: value };
            return updated;
        });
    };

    const increaseCount = () => {
        setSubtaskCount(c => c + 1);
        setSubtasks(prev => [
            ...prev,
            { id: null, title: '' }
        ]);
    };

    const decreaseCount = () => {
        if (subtaskCount > 0) {
            setSubtaskCount(c => c - 1);
            setSubtasks(prev => prev.slice(0, -1));
        }
    };

    /* ------------------- روزهای روتین ------------------- */
    const toggleDay = (day) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    /* ------------------- دسته‌بندی‌ها ------------------- */
    const toggleCategory = (i) => {
        const newCategories = [...categories];
        newCategories[i].selected = !newCategories[i].selected;
        setCategories(newCategories);
    };

    /* ------------------- تقویم deadline ------------------- */
    const handleDateSelect = (date) => {
        setDueDate(date);
        setShowCalendar(false);
    };

    const getJalaliDate = (dateStr) => {
        if (!dateStr) return '';
        const m = moment(dateStr, 'YYYY-MM-DD', true);
        if (!m.isValid()) {
            console.log('تاریخ نامعتبر برای تبدیل:', dateStr);
            return '';
        }
        return m.locale('fa').format('jYYYY/jMM/jDD');
    };

    /* ------------------- تقویم done date ------------------- */
    const handleDoneDateSelect = (date) => {
        setDoneDate(date);
        setShowDoneDateCalendar(false);
    };

    /* ------------------- چک کردن آیا deadline در آینده است ------------------- */
    const isDeadlineInFuture = () => {
        if (!dueDate) return false;
        const today = moment().startOf('day');
        const deadline = moment(dueDate, 'YYYY-MM-DD');
        return deadline.isAfter(today);
    };

    /* ------------------- ارسال فرم ------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = { name: '', dueDate: '', doneDate: '', form: '' };

        if (!name.trim()) newErrors.name = 'این فیلد الزامی است';
        // تاریخ انقضا دیگر الزامی نیست
        // if (!dueDate) newErrors.dueDate = 'این فیلد الزامی است';

        // اگر "قبلاً انجام دادی" تیک خورده، تاریخ انجام الزامی است
        if (isDoneAlready && !doneDate) {
            newErrors.doneDate = 'تاریخ انجام الزامی است';
        }

        if (newErrors.name || newErrors.doneDate) {
            setErrors(newErrors);
            return;
        }

        // تبدیل روزهای فارسی به اعداد
        const repeatDaysNumbers = isRoutine && selectedDays.length > 0
            ? selectedDays.map(day => dayMapping[day]).filter(Boolean)
            : [];

        // فقط دسته‌های انتخاب‌شده را ارسال کن (فقط name)
        const selectedCategories = categories
            .filter(c => c.selected)
            .map(c => ({ name: c.name }));

        // تاریخ done_date
        let finalDoneDate = null;
        if (isDoneAlready && doneDate) {
            const doneDateMoment = moment(doneDate, 'YYYY-MM-DD');
            const today = moment().startOf('day');

            // فقط اگر تاریخ انجام امروز یا گذشته باشد
            if (doneDateMoment.isSameOrBefore(today)) {
                finalDoneDate = doneDateMoment.format('YYYY-MM-DD');
            }
        }

        const taskData = {
            id: initialTask?.id,
            title: name.trim(),
            description: description.trim(),
            deadline_date: dueDate ? moment(dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD') : null,
            deadline_time: time || '23:59:00',
            flag_tuNobat: isInNobat,
            is_routine_active: isRoutine,
            repeat_days: repeatDaysNumbers, // حالا همیشه آرایه است (خالی یا پر)
            subtasks: subtasks
                .filter(s => s.title.trim() !== '')
                .map(s => ({
                    id: typeof s.id === 'number' ? s.id : null,
                    title: s.title.trim(),
                })),
            categories: selectedCategories,
            done_date: finalDoneDate,
            done_time: isDoneAlready && time ? time : null,
            duration: isDoneAlready && duration ? duration : '00:00:00',
            routine_father: initialTask?.routine_father || null,
        };

        console.log('Sending task data to API:', taskData);

        const result = initialTask ? await editTask(taskData) : await addTask(taskData);

        if (result.success) {
            onTaskAdded(result.task);
            onClose();
            resetForm();
        } else {
            setErrors(prev => ({
                ...prev,
                form: result.error?.detail || result.error || 'خطا در ذخیره تسک'
            }));
        }
    };

    const resetForm = () => {
        setName('');
        setTime('');
        setDueDate('');
        setDescription('');
        setDuration('');
        setSubtasks([]);
        setSubtaskCount(0);
        setIsRoutine(false);
        setIsInNobat(false);
        setSelectedDays([]);
        setIsDoneAlready(false);
        setDoneDate('');
        setCategories(prev => prev.map(c => ({ ...c, selected: false })));
        setErrors({ name: '', dueDate: '', doneDate: '', form: '' });
        setShowCalendar(false);
        setShowDoneDateCalendar(false);
    };

    /* ------------------- ارتفاع خط کنار مودال ------------------- */
    useEffect(() => {
        const updateHeight = () => {
            if (modalRef.current) {
                const border = modalRef.current.querySelector('.AddTaskModal-border');
                if (border) border.style.height = `${modalRef.current.scrollHeight - 30}px`;
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [showAdvanced, subtaskCount, subtasks, isRoutine, selectedDays, showCalendar, isDoneAlready, showDoneDateCalendar]);

    const routineDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

    if (!isOpen) return null;

    return (
        <div className="AddTaskModal" ref={modalRef}>
            <div className="AddTaskModal-border"></div>
            <span className="AddTaskModal-title">
                {initialTask ? 'ویرایش تسک' : 'اضافه کردن تسک جدید'}
            </span>

            <form className="AddTaskModal-form" onSubmit={handleSubmit}>
                {/* نام تسک */}
                <div className="form-group">
                    <label>نام <span className="required-star">★</span></label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="چیکار میخوای بکنی؟"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* توضیحات */}
                <div className="form-group">
                    <label>توضیحات</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="هرچه دل تنگت میخواهد بگو"
                    />
                </div>

                {/* کارت قراره تکرار بشه؟ */}
                <div className="checkbox-group mt-3">
                    <label>
                        <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={isRoutine}
                            onChange={e => setIsRoutine(e.target.checked)}
                        />
                        کارت قراره تکرار بشه؟
                    </label>
                </div>

                {/* انتخاب روزهای هفته */}
                {isRoutine && (
                    <div className="routine-days mt-3">
                        <div className="days-box">
                            {routineDays.map(day => (
                                <div
                                    key={day}
                                    className={`day-circle ${selectedDays.includes(day) ? 'selected' : ''}`}
                                    onClick={() => toggleDay(day)}
                                >
                                    {day.charAt(0)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* تاریخ و ساعت انقضا */}
                <div className="d-flex justify-content-between gap-3 mt-3">
                    <div className="form-group flex-grow-1">
                        <label>تاریخ انقضا</label>
                        <div className="date-input-wrapper">
                            <input
                                type="text"
                                className="form-control date-display"
                                value={getJalaliDate(dueDate)}
                                onClick={() => setShowCalendar(!showCalendar)}
                                readOnly
                                placeholder="انتخاب تاریخ"
                            />
                        </div>
                        {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                    </div>
                    <div className="form-group flex-grow-1">
                        <label>ساعت</label>
                        <input
                            type="time"
                            className="form-control"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                        />
                    </div>
                </div>

                {showCalendar && (
                    <div className="calendar-section">
                        <CompactCalendar
                            selectedDate={dueDate}
                            onDateSelect={handleDateSelect}
                            onClose={() => setShowCalendar(false)}
                        />
                    </div>
                )}

                {/* نوبتش میشه - فقط برای آینده */}
                {isDeadlineInFuture() && (
                    <div className="checkbox-group mt-3">
                        <label>
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={isInNobat}
                                onChange={e => setIsInNobat(e.target.checked)}
                            />
                            دوست داری تو بخش نوبتش میشه کارت رو ببینی؟
                        </label>
                    </div>
                )}

                {/* گزینه‌های بیشتر */}
                <div className="toggle-advanced mt-3" onClick={() => setShowAdvanced(!showAdvanced)}>
                    <span className="toggle-text">گزینه‌های بیشتر</span>
                    <span className="toggle-arrow">{showAdvanced ? '↓' : '↑'}</span>
                </div>

                {showAdvanced && (
                    <div className="mt-3">
                        {/* قبلاً انجام دادی؟ */}
                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={isDoneAlready}
                                    onChange={e => setIsDoneAlready(e.target.checked)}
                                />
                                پیش پیش کار رو انجام دادی؟ (میخوای فقط گزارشش رو بدی؟)
                            </label>
                        </div>

                        {/* تاریخ انجام و مدت زمان */}
                        {isDoneAlready && (
                            <div className="mt-3">
                                <div className="form-group">
                                    <label>تاریخ انجام <span className="required-star">★</span></label>
                                    <div className="date-input-wrapper">
                                        <input
                                            type="text"
                                            className="form-control date-display"
                                            value={getJalaliDate(doneDate)}
                                            onClick={() => setShowDoneDateCalendar(!showDoneDateCalendar)}
                                            readOnly
                                            placeholder="انتخاب تاریخ انجام"
                                        />
                                    </div>
                                    {errors.doneDate && <span className="error-message">{errors.doneDate}</span>}
                                </div>

                                {showDoneDateCalendar && (
                                    <div className="calendar-section">
                                        <CompactCalendar
                                            selectedDate={doneDate}
                                            onDateSelect={handleDoneDateSelect}
                                            onClose={() => setShowDoneDateCalendar(false)}
                                        />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>مدت زمان انجام</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={duration}
                                        onChange={e => setDuration(e.target.value)}
                                        placeholder="HH:MM:SS"
                                        step="1"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ساب‌تسک‌ها */}
                        <div className="mt-3">
                            <label className="subtask-label">
                                کارت رو به چند بخش تقسیم میکنی؟
                                <button type="button" className="btn-circle btn-decrease" onClick={decreaseCount}>-</button>
                                <span className="subtask-count">{subtaskCount}</span>
                                <button type="button" className="btn-circle btn-increase" onClick={increaseCount}>+</button>
                            </label>

                            {subtasks.map((subtask, index) => (
                                <div className="form-group" key={index}>
                                    <input
                                        type="text"
                                        className="form-control subtask-input"
                                        value={subtask.title || ''}
                                        onChange={e => handleSubtaskChange(index, e.target.value)}
                                        placeholder={`زیرتسک ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* دسته‌بندی‌ها - Fixed categories */}
                        <div className="tag-section mt-3">
                            <label>این کار عضو چه دسته‌ای از فعالیت‌هاته؟</label>
                            <div className="tag-container">
                                {categories.map((cat, i) => (
                                    <div
                                        key={cat.id}
                                        className={`tag ${cat.selected ? 'selected' : ''}`}
                                        style={{ backgroundColor: cat.color }}
                                        onClick={() => toggleCategory(i)}
                                    >
                                        <span>{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {errors.form && <div className="error-message mt-3">{errors.form}</div>}

                <div className="d-flex justify-content-end mt-4 gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>بستن</button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!name.trim() || (isDoneAlready && !doneDate)}
                    >
                        {initialTask ? 'ذخیره تغییرات' : 'ذخیره'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskModal;