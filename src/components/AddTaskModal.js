import React, { useState, useEffect, useRef } from 'react';
import './AddTaskModal.scss';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, task }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [subtaskCount, setSubtaskCount] = useState(task ? task.subtasks.length : 0);
    const [subtasks, setSubtasks] = useState(task ? task.subtasks.map(st => st.title) : []);
    const [isRoutine, setIsRoutine] = useState(task ? task.flag_tuNobat : false);
    const [selectedDays, setSelectedDays] = useState(task ? task.selectedDays || [] : []);
    const modalRef = useRef(null);
    const [tags, setTags] = useState(
        task
            ? task.tags.map(t => ({ ...t, selected: true }))
            : [
                { name: 'ورزش', color: '#34AA7B', selected: false },
                { name: 'کار', color: '#DA348D', selected: false },
                { name: 'کلاس', color: '#4690E4', selected: false },
            ]
    );
    const [newTag, setNewTag] = useState('');
    const [showNewTagInput, setShowNewTagInput] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [name, setName] = useState(task ? task.title : '');
    const [hour, setHour] = useState(task ? task.deadline_date.split('T')[1]?.slice(0, 5) || '' : '');
    const [dueDate, setDueDate] = useState(task ? task.deadline_date.split('T')[0] : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [errors, setErrors] = useState({ name: '', hour: '', dueDate: '' });

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = value;
        setSubtasks(newSubtasks);
    };

    const increaseCount = () => {
        setSubtaskCount((prev) => prev + 1);
        setSubtasks((prevSubs) => [...prevSubs, '']);
    };

    const decreaseCount = () => {
        if (subtaskCount > 0) {
            setSubtaskCount((prev) => prev - 1);
            setSubtasks((prevSubs) => prevSubs.slice(0, prevSubs.length - 1));
        }
    };

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const toggleTag = (index) => {
        const updatedTags = [...tags];
        updatedTags[index].selected = !updatedTags[index].selected;
        setTags(updatedTags);
    };

    const handleTagEdit = (index) => {
        setEditingTag(index);
    };

    const handleTagChange = (index, value) => {
        const updatedTags = [...tags];
        updatedTags[index].name = value;
        setTags(updatedTags);
    };

    const addNewTag = () => {
        if (newTag.trim()) {
            setTags([...tags, { name: newTag, color: getRandomColor(), selected: true }]);
            setNewTag('');
            setShowNewTagInput(false);
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = { name: '', hour: '', dueDate: '' };
        if (!name.trim()) newErrors.name = 'این فیلد الزامی است';
        if (!hour.trim()) newErrors.hour = 'این فیلد الزامی است';
        if (!dueDate.trim()) newErrors.dueDate = 'این فیلد الزامی است';
        if (Object.values(newErrors).some(error => error)) {
            setErrors(newErrors);
        } else {
            const selectedTags = tags.filter(tag => tag.selected).map(tag => ({ name: tag.name, color: tag.color }));
            const newTask = {
                id: task ? task.id : Date.now(),
                title: name,
                description: description,
                deadline_date: `${dueDate}T${hour}:00`,
                flag_tuNobat: isRoutine,
                subtasks: subtasks.map((subtask, index) => ({
                    id: task && task.subtasks[index] ? task.subtasks[index].id : index + 1,
                    title: subtask,
                    done_date: task && task.subtasks[index] ? task.subtasks[index].done_date : null,
                })),
                tags: selectedTags,
                selectedDays,
            };
            onTaskAdded(newTask);
            onClose();
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setHour('');
        setDueDate('');
        setDescription('');
        setSubtaskCount(0);
        setSubtasks([]);
        setIsRoutine(false);
        setSelectedDays([]);
        setTags(tags.map(tag => ({ ...tag, selected: false })));
        setErrors({ name: '', hour: '', dueDate: '' });
    };

    useEffect(() => {
        const updateBorderHeight = () => {
            if (modalRef.current) {
                const modalContent = modalRef.current;
                const border = modalContent.querySelector('.AddTaskModal-border');
                requestAnimationFrame(() => {
                    const contentHeight = modalContent.scrollHeight;
                    border.style.height = `${contentHeight - 30}px`;
                });
            }
        };
        updateBorderHeight();
        window.addEventListener('resize', updateBorderHeight);
        return () => window.removeEventListener('resize', updateBorderHeight);
    }, [subtaskCount, showAdvanced, subtasks, isRoutine, selectedDays, tags]);

    if (!isOpen) return null;

    return (
        <div className="AddTaskModal" ref={modalRef}>
            <div className="AddTaskModal-border"></div>
            <span className="AddTaskModal-title">{task ? 'ویرایش تسک' : 'افزودن تسک'}</span>
            <div className="AddTaskModal-content">
                <div className="form-group">
                    <label>نام <span className="required-star">★</span></label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>توضیحات</label>
                    <textarea
                        className="form-control"
                        rows="1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-between gap-3">
                    <div className="form-group flex-grow-1">
                        <label>ساعت <span className="required-star">★</span></label>
                        <input
                            type="time"
                            className="form-control"
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                        />
                        {errors.hour && <span className="error-message">{errors.hour}</span>}
                    </div>
                    <div className="form-group flex-grow-1">
                        <label>تاریخ انقضا <span className="required-star">★</span></label>
                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
                    </div>
                </div>
                <div className="checkbox-group mt-3">
                    <label>
                        <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={isRoutine}
                            onChange={(e) => setIsRoutine(e.target.checked)}
                        /> آیا کارت یک روتینه؟
                    </label>
                </div>
                {isRoutine && (
                    <div className="routine-days mt-3">
                        <div className="days-box">
                            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
                                <div
                                    key={day}
                                    className={`day-circle ${selectedDays.includes(day) ? 'selected' : ''}`}
                                    onClick={() => toggleDay(day)}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div
                    className="toggle-advanced text-right mt-3"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    <span className="toggle-text">گزینه‌های بیشتر</span>
                    <span className="toggle-arrow">{showAdvanced ? '↑' : '↓'}</span>
                </div>
                {showAdvanced && (
                    <div className="mt-3">
                        <label className="subtask-label">
                            این کارت رو به چند قسمت تقسیم می‌کنی؟
                            <button
                                type="button"
                                className="btn-circle btn-decrease"
                                onClick={decreaseCount}
                            >
                                -
                            </button>
                            <span className="subtask-count">{subtaskCount}</span>
                            <button
                                type="button"
                                className="btn-circle btn-increase"
                                onClick={increaseCount}
                            >
                                +
                            </button>
                        </label>
                        {subtasks.map((value, index) => (
                            <div className="form-group" key={index}>
                                <input
                                    type="text"
                                    className="form-control subtask-input"
                                    value={value}
                                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                    placeholder={`ساب‌تسک ${index + 1}`}
                                />
                            </div>
                        ))}
                        <div className="tag-section mt-3">
                            <label>این کار عضو چه دسته‌ای از فعالیت‌هاته؟</label>
                            <div className="tag-container">
                                {tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className={`tag ${tag.selected ? 'selected' : ''}`}
                                        style={{ backgroundColor: tag.color }}
                                        onClick={() => toggleTag(index)}
                                    >
                                        {editingTag === index ? (
                                            <input
                                                type="text"
                                                value={tag.name}
                                                onChange={(e) => handleTagChange(index, e.target.value)}
                                                onBlur={() => setEditingTag(null)}
                                                autoFocus
                                            />
                                        ) : (
                                            <span onClick={(e) => { e.stopPropagation(); handleTagEdit(index); }}>
                        {tag.name}
                      </span>
                                        )}
                                    </div>
                                ))}
                                <div
                                    className="tag more-tag"
                                    onClick={() => setShowNewTagInput(true)}
                                >
                                    بیشتر
                                </div>
                                {showNewTagInput && (
                                    <div className="tag new-tag">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onBlur={addNewTag}
                                            onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="d-flex justify-content-end mt-4 gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        بستن
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!name.trim() || !hour.trim() || !dueDate.trim()}
                    >
                        {task ? 'به‌روزرسانی تسک' : 'ذخیره تسک'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;