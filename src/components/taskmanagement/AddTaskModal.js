import React, { useState, useEffect, useRef } from 'react';
import './AddTaskModal.scss';
import moment from 'jalali-moment';
import CompactCalendar from '../CompactClendar';
import { categoriesAPI } from '../../api/apiService';

/* آیکون تقویم برای ورودی‌های تاریخ */
const CalendarIcon = () => (
    <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

/* آیکون تیک برای دسته‌های انتخاب‌شده */
const CheckIcon = () => (
    <svg className="tag-check" width="14" height="14" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* آیکون بستن */
const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/* آیکون پلاس */
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2.5"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const AddTaskModal = ({ isOpen, onClose, onSave, initialTask, selectedDate }) => {

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

    // Categories - fetched from API + user-created ones
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [errors, setErrors] = useState({ name: '', dueDate: '', doneDate: '', form: '', category: '' });

    // Mapping روزهای فارسی به اعداد 1-7
    const dayMapping = {
        'شنبه': 1, 'یکشنبه': 2, 'دوشنبه': 3, 'سه‌شنبه': 4,
        'چهارشنبه': 5, 'پنج‌شنبه': 6, 'جمعه': 7
    };

    const reverseDayMapping = {
        1: 'شنبه', 2: 'یکشنبه', 3: 'دوشنبه', 4: 'سه‌شنبه',
        5: 'چهارشنبه', 6: 'پنج‌شنبه', 7: 'جمعه'
    };

    /* ------------------- Fetch categories from API ------------------- */
    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const data = await categoriesAPI.getMyCategories();
            const categoriesList = Array.isArray(data)
                ? data.map(cat => cat.name || cat)
                : [];
            setAvailableCategories(categoriesList);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setAvailableCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    /* ------------------- پر کردن فرم برای ویرایش ------------------- */
    useEffect(() => {
        if (initialTask) {
            setName(initialTask.title || '');
            setDescription(initialTask.description || '');
            setTime(initialTask.deadline_time || '');

            if (initialTask.deadline_date) {
                setDueDate(initialTask.deadline_date);
            } else {
                setDueDate('');
            }

            setIsInNobat(!!initialTask.flag_tuNobat);
            setIsRoutine(!!initialTask.is_routine_active);

            if (initialTask.repeat_days && Array.isArray(initialTask.repeat_days)) {
                const days = initialTask.repeat_days
                    .map(num => reverseDayMapping[num])
                    .filter(Boolean);
                setSelectedDays(days);
            } else {
                setSelectedDays([]);
            }

            const serverSubtasks = (initialTask.subtasks || [])
                .filter(sub => sub.id && Number.isInteger(sub.id))
                .map(sub => ({
                    id: sub.id,
                    title: sub.title || '',
                    isExisting: true,
                }));

            setSubtasks(serverSubtasks);
            setSubtaskCount(serverSubtasks.length);

            // Extract category names from task's categories
            const taskCategories = Array.isArray(initialTask.categories)
                ? initialTask.categories.map(c => c.name || c).filter(Boolean)
                : [];
            setSelectedCategoryNames(taskCategories);

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
            resetFormFields();

            const date = moment(selectedDate, ['YYYY-MM-DD', 'jYYYY/jMM/jDD']);
            if (date.isValid()) {
                setDueDate(date.format('YYYY-MM-DD'));
            }
        }

    }, [initialTask, selectedDate]);

    const resetFormFields = () => {
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
        setSelectedCategoryNames([]);
        setNewCategoryName('');
        setErrors({ name: '', dueDate: '', doneDate: '', form: '', category: '' });
        setShowCalendar(false);
        setShowDoneDateCalendar(false);
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
        setSubtasks(prev => [...prev, { id: null, title: '', isExisting: false }]);
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
    const toggleCategorySelection = (categoryName) => {
        setSelectedCategoryNames(prev =>
            prev.includes(categoryName)
                ? prev.filter(name => name !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleAddNewCategory = () => {
        const trimmed = newCategoryName.trim();
        if (!trimmed) return;

        // Check if already exists (in available or selected)
        const allExisting = [...availableCategories, ...selectedCategoryNames];
        if (allExisting.includes(trimmed)) {
            // If exists but not selected, select it
            if (!selectedCategoryNames.includes(trimmed)) {
                setSelectedCategoryNames(prev => [...prev, trimmed]);
            }
            setNewCategoryName('');
            return;
        }

        // Add to available and select it
        setAvailableCategories(prev => [...prev, trimmed]);
        setSelectedCategoryNames(prev => [...prev, trimmed]);
        setNewCategoryName('');
    };

    const handleCategoryKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddNewCategory();
        }
    };

    /* ------------------- تقویم deadline ------------------- */
    const handleDateSelect = (date) => {
        setDueDate(date);
        setShowCalendar(false);
    };

    const getJalaliDate = (dateStr) => {
        if (!dateStr) return '';
        const m = moment(dateStr, 'YYYY-MM-DD', true);
        if (!m.isValid()) return '';
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

        const newErrors = { name: '', dueDate: '', doneDate: '', form: '', category: '' };

        if (!name.trim()) newErrors.name = 'این فیلد الزامی است';
        if (isDoneAlready && !doneDate) newErrors.doneDate = 'تاریخ انجام الزامی است';

        if (newErrors.name || newErrors.doneDate) {
            setErrors(newErrors);
            return;
        }

        const repeatDaysNumbers = isRoutine && selectedDays.length > 0
            ? selectedDays.map(day => dayMapping[day]).filter(Boolean)
            : [];

        // Categories as array of { name: "..." }
        const selectedCategories = selectedCategoryNames.map(catName => ({
            name: catName,
        }));

        let finalDoneDate = null;

        if (isDoneAlready && doneDate) {
            const doneDateMoment = moment(doneDate, 'YYYY-MM-DD');
            const today = moment().startOf('day');

            if (doneDateMoment.isSameOrBefore(today)) {
                finalDoneDate = doneDateMoment.format('YYYY-MM-DD');
            }
        }

        const processedSubtasks = subtasks
            .filter(s => s.title && s.title.trim() !== '')
            .map(s => {
                if (s.id && Number.isInteger(s.id)) {
                    return {
                        id: s.id,
                        title: s.title.trim(),
                        description: s.description || null,
                        done_date: s.done_date || null,
                    };
                }

                return {
                    title: s.title.trim(),
                };
            });

        const taskData = {
            id: initialTask?.id,
            title: name.trim(),
            description: description.trim(),
            deadline_date: dueDate
                ? moment(dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            deadline_time: time || '23:59:00',
            flag_tuNobat: isInNobat,
            is_routine_active: isRoutine,
            repeat_days: repeatDaysNumbers,
            subtasks: processedSubtasks,
            categories: selectedCategories,
            done_date: finalDoneDate,
            done_time: isDoneAlready && time ? time : null,
            duration: isDoneAlready && duration ? duration : '00:00:00',
            routine_father: initialTask?.routine_father || null,
        };

        const result = await onSave(taskData);

        if (result?.success) {
            onClose();
            resetFormFields();
        } else {
            setErrors(prev => ({
                ...prev,
                form: result?.error?.detail || result?.error || 'خطا در ذخیره تسک',
            }));
        }
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
    }, [showAdvanced, subtaskCount, subtasks, isRoutine, selectedDays, showCalendar, isDoneAlready, showDoneDateCalendar, availableCategories, selectedCategoryNames]);

    const routineDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

    if (!isOpen) return null;
    return (
        <div className="AddTaskModal" ref={modalRef}>
            <div className="AddTaskModal-border"></div>

            <button
                type="button"
                className="AddTaskModal-close"
                onClick={onClose}
                aria-label="بستن"
            >
                <CloseIcon />
            </button>

            <span className="AddTaskModal-title">
                {initialTask ? 'ویرایش تسک' : 'اضافه کردن تسک جدید'}
            </span>

            <form className="AddTaskModal-form" onSubmit={handleSubmit}>
                {/* نام تسک */}
                <div className="form-group">
                    <label htmlFor="task-name">
                        نام <span className="required-star">★</span>
                    </label>
                    <input
                        id="task-name"
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="چیکار میخوای بکنی؟"
                        aria-invalid={!!errors.name}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* توضیحات */}
                <div className="form-group">
                    <label htmlFor="task-desc">توضیحات</label>
                    <textarea
                        id="task-desc"
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
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={selectedDays.includes(day)}
                                    className={`day-circle ${selectedDays.includes(day) ? 'selected' : ''}`}
                                    onClick={() => toggleDay(day)}
                                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleDay(day)}
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
                        <label htmlFor="due-date">تاریخ انقضا</label>
                        <div className="date-input-wrapper">
                            <CalendarIcon />
                            <input
                                id="due-date"
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
                        <label htmlFor="due-time">ساعت</label>
                        <input
                            id="due-time"
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
                <button
                    type="button"
                    className="toggle-advanced mt-3"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    aria-expanded={showAdvanced}
                >
                    <span className="toggle-text">گزینه‌های بیشتر</span>
                    <span className={`toggle-arrow ${showAdvanced ? 'open' : ''}`}>⌄</span>
                </button>

                {showAdvanced && (
                    <div className="advanced-section mt-3">
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
                                    <label htmlFor="done-date">
                                        تاریخ انجام <span className="required-star">★</span>
                                    </label>
                                    <div className="date-input-wrapper">
                                        <CalendarIcon />
                                        <input
                                            id="done-date"
                                            type="text"
                                            className="form-control date-display"
                                            value={getJalaliDate(doneDate)}
                                            onClick={() => setShowDoneDateCalendar(!showDoneDateCalendar)}
                                            readOnly
                                            placeholder="انتخاب تاریخ انجام"
                                            aria-invalid={!!errors.doneDate}
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
                                    <label htmlFor="duration">مدت زمان انجام</label>
                                    <input
                                        id="duration"
                                        type="time"
                                        className="form-control"
                                        value={duration}
                                        onChange={e => setDuration(e.target.value)}
                                        step="1"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ساب‌تسک‌ها */}
                        <div className="mt-3">
                            <div className="subtask-label">
                                <span>کارت رو به چند بخش تقسیم میکنی؟</span>
                                <button type="button" className="btn-circle btn-decrease"
                                        onClick={decreaseCount} aria-label="کاهش زیرتسک">−</button>
                                <span className="subtask-count">{subtaskCount}</span>
                                <button type="button" className="btn-circle btn-increase"
                                        onClick={increaseCount} aria-label="افزودن زیرتسک">+</button>
                            </div>

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

                        {/* دسته‌بندی‌ها */}
                        <div className="tag-section mt-3">
                            <label>این کار عضو چه دسته‌ای از فعالیت‌هاته؟</label>

                            {/* Input to add new category */}
                            <div className="category-input-row">
                                <input
                                    type="text"
                                    className="form-control category-input"
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                    onKeyDown={handleCategoryKeyDown}
                                    placeholder="نام دسته جدید..."
                                />
                                <button
                                    type="button"
                                    className="btn-add-category"
                                    onClick={handleAddNewCategory}
                                    disabled={!newCategoryName.trim()}
                                    aria-label="اضافه کردن دسته"
                                >
                                    <PlusIcon />
                                </button>
                            </div>

                            {/* Loading state */}
                            {categoriesLoading ? (
                                <div className="categories-loading">در حال بارگذاری...</div>
                            ) : (
                                /* Category tags */
                                <div className="tag-container">
                                    {availableCategories.map((catName, i) => (
                                        <div
                                            key={`${catName}-${i}`}
                                            role="button"
                                            tabIndex={0}
                                            aria-pressed={selectedCategoryNames.includes(catName)}
                                            className={`tag ${selectedCategoryNames.includes(catName) ? 'selected' : ''}`}
                                            onClick={() => toggleCategorySelection(catName)}
                                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleCategorySelection(catName)}
                                        >
                                            {selectedCategoryNames.includes(catName) && <CheckIcon />}
                                            <span>{catName}</span>
                                        </div>
                                    ))}

                                    {availableCategories.length === 0 && !categoriesLoading && (
                                        <div className="no-categories-hint">
                                            هنوز دسته‌ای نساختی! از بالا یه دسته جدید بساز
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {errors.form && <div className="error-message form-error mt-3">{errors.form}</div>}

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