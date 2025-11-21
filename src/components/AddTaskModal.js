// components/AddTaskModal.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import './AddTaskModal.scss';
import moment from 'jalali-moment';
import { TaskContext } from './TaskContext';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, initialTask, selectedDate }) => {
    const { addTask, editTask } = useContext(TaskContext);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [subtaskCount, setSubtaskCount] = useState(0);
    const [subtasks, setSubtasks] = useState([]);
    const [isRoutine, setIsRoutine] = useState(false);
    const [isInNobat, setIsInNobat] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const modalRef = useRef(null);

    const [tags, setTags] = useState([
        { name: 'ورزش', color: '#34AA7B', selected: false },
        { name: 'کار', color: '#DA348D', selected: false },
        { name: 'کلاس', color: '#4690E4', selected: false },
    ]);
    const [newTag, setNewTag] = useState('');
    const [showNewTagInput, setShowNewTagInput] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const [name, setName] = useState('');
    const [hour, setHour] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({ name: '', dueDate: '', form: '' });

    /* ------------------- پر کردن فرم ------------------- */
    useEffect(() => {
        if (initialTask) {
            setName(initialTask.title || '');
            setDescription(initialTask.description || '');
            setHour(initialTask.hour || '');
            setDueDate(
                initialTask.deadline_date
                    ? moment(initialTask.deadline_date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
                    : ''
            );
            setIsInNobat(!!initialTask.flag_tuNobat);
            setIsRoutine(!!initialTask.selectedDays?.length);
            setSelectedDays(initialTask.selectedDays || []);

            // فقط ساب‌تسک‌های سرور (id عددی) → id واقعی، بقیه حذف میشه
            const serverSubtasks = (initialTask.subtasks || [])
                .filter(sub => sub.id && Number.isInteger(sub.id)) // فقط ساب‌تسک‌های ذخیره‌شده در دیتابیس
                .map(sub => ({
                    id: sub.id,
                    title: sub.title || '',
                    done_date: sub.done_date || null,
                }));

            setSubtasks(serverSubtasks);
            setSubtaskCount(serverSubtasks.length);

            setTags(prev => prev.map(tag => ({
                ...tag,
                selected: initialTask.tags?.some(t => t.name === tag.name) || false
            })));
        } else if (selectedDate) {
            setDueDate(moment(selectedDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'));
            setSubtasks([]);
            setSubtaskCount(0);
            setIsRoutine(false);
            setIsInNobat(false);
            setSelectedDays([]);
        }
    }, [initialTask, selectedDate]);

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
            { id: `temp-${Date.now()}-${prev.length}`, title: '', done_date: null }
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

    /* ------------------- تگ‌ها ------------------- */
    const toggleTag = (i) => {
        const newTags = [...tags];
        newTags[i].selected = !newTags[i].selected;
        setTags(newTags);
    };

    const addNewTag = () => {
        if (newTag.trim()) {
            setTags([...tags, {
                name: newTag.trim(),
                color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                selected: false
            }]);
            setNewTag('');
            setShowNewTagInput(false);
        }
    };

    /* ------------------- ارسال فرم ------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = { name: '', dueDate: '', form: '' };
        if (!name.trim()) newErrors.name = 'این فیلد الزامی است';
        if (!dueDate) newErrors.dueDate = 'این فیلد الزامی است';
        if (newErrors.name || newErrors.dueDate) {
            setErrors(newErrors);
            return;
        }

        const selectedTags = tags.filter(t => t.selected).map(t => ({ name: t.name, color: t.color }));

        const taskData = {
            id: initialTask?.id,
            title: name.trim(),
            description: description.trim(),
            deadline_date: moment(dueDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            flag_tuNobat: isInNobat,
            hour: hour || null,
            selectedDays: isRoutine ? selectedDays : [],
            subtasks: subtasks
                .filter(s => s.title.trim() !== '')
                .map(s => ({
                    id: typeof s.id === 'number' ? s.id : null, // فقط id عددی (واقعی) می‌فرستیم
                    title: s.title.trim(),
                    done_date: s.done_date
                })),
            tags: selectedTags,
            isDone: initialTask?.isDone || false,
            originalIndex: initialTask?.originalIndex || 0,
        };

        const result = initialTask ? await editTask(taskData) : await addTask(taskData);

        if (result.success) {
            onTaskAdded(result.task);
            onClose();
            resetForm();
        } else {
            setErrors(prev => ({ ...prev, form: result.error?.detail || result.error || 'خطا در ذخیره تسک' }));
        }
    };

    const resetForm = () => {
        setName(''); setHour(''); setDueDate(''); setDescription('');
        setSubtasks([]); setSubtaskCount(0);
        setIsRoutine(false); setIsInNobat(false); setSelectedDays([]);
        setTags(prev => prev.map(t => ({ ...t, selected: false })));
        setErrors({ name: '', dueDate: '', form: '' });
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
    }, [showAdvanced, subtaskCount, subtasks, isRoutine, selectedDays]);

    const routineDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

    if (!isOpen) return null;

    return (
        <div className="AddTaskModal" ref={modalRef}>
            <div className="AddTaskModal-border"></div>
            <span className="AddTaskModal-title">
                {initialTask ? 'ویرایش تسک' : 'اضافه کردن تسک جدید'}
            </span>

            <form className="AddTaskModal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>نام <span className="required-star">★</span></label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label>توضیحات</label>
                    <textarea className="form-control" rows="1" value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="d-flex justify-content-between gap-3">
                    <div className="form-group flex-grow-1">
                        <label>ساعت</label>
                        <input type="time" className="form-control" value={hour} onChange={e => setHour(e.target.value)} />
                    </div>
                    <div className="form-group flex-grow-1">
                        <label>تاریخ انقضا <span className="required-star">★</span></label>
                        <input type="date" className="form-control" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                        {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                    </div>
                </div>

                <div className="checkbox-group mt-3">
                    <label>
                        <input type="checkbox" className="custom-checkbox" checked={isInNobat} onChange={e => setIsInNobat(e.target.checked)} />
                        دوست داری تو بخش نوبتش میشه ببینی؟
                    </label>
                    <label>
                        <input type="checkbox" className="custom-checkbox" checked={isRoutine} onChange={e => setIsRoutine(e.target.checked)} />
                        آیا کارت یک روتینه؟
                    </label>
                </div>

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

                <div className="toggle-advanced mt-3" onClick={() => setShowAdvanced(!showAdvanced)}>
                    <span className="toggle-text">گزینه‌های بیشتر</span>
                    <span className="toggle-arrow">{showAdvanced ? '↓' : '↑'}</span>
                </div>

                {showAdvanced && (
                    <div className="mt-3">
                        <label className="subtask-label">
                            این کارت رو به چند قسمت تقسیم می‌کنی؟
                            <button type="button" className="btn-circle btn-decrease" onClick={decreaseCount}>-</button>
                            <span className="subtask-count">{subtaskCount}</span>
                            <button type="button" className="btn-circle btn-increase" onClick={increaseCount}>+</button>
                        </label>

                        {subtasks.map((subtask, index) => (
                            <div className="form-group" key={subtask.id}>
                                <input
                                    type="text"
                                    className="form-control subtask-input"
                                    value={subtask.title || ''}
                                    onChange={e => handleSubtaskChange(index, e.target.value)}
                                    placeholder={`زیرتسک ${index + 1}`}
                                />
                            </div>
                        ))}

                        <div className="tag-section mt-3">
                            <label>این کار عضو چه دسته‌ای از فعالیت‌هاته؟</label>
                            <div className="tag-container">
                                {tags.map((tag, i) => (
                                    <div
                                        key={i}
                                        className={`tag ${tag.selected ? 'selected' : ''}`}
                                        style={{ backgroundColor: tag.color }}
                                        onClick={() => toggleTag(i)}
                                    >
                                        {editingTag === i ? (
                                            <input
                                                type="text"
                                                value={tag.name}
                                                onChange={e => {
                                                    const nt = [...tags];
                                                    nt[i].name = e.target.value;
                                                    setTags(nt);
                                                }}
                                                onBlur={() => setEditingTag(null)}
                                                autoFocus
                                            />
                                        ) : (
                                            <span onClick={e => { e.stopPropagation(); setEditingTag(i); }}>
                                                {tag.name}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <div className="tag more-tag" onClick={() => setShowNewTagInput(true)}>تگ جدید</div>
                                {showNewTagInput && (
                                    <div className="tag new-tag">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={e => setNewTag(e.target.value)}
                                            onBlur={addNewTag}
                                            onKeyPress={e => e.key === 'Enter' && addNewTag()}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {errors.form && <div className="error-message">{errors.form}</div>}

                <div className="d-flex justify-content-end mt-4 gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>بستن</button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!name.trim() || !dueDate}
                    >
                        {initialTask ? 'ذخیره تغییرات' : 'ذخیره'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskModal;