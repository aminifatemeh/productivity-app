
import React, { useState, useEffect, useRef } from 'react';
import './AddTaskModal.scss';

const AddTaskModal = ({ isOpen, onClose }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [subtaskCount, setSubtaskCount] = useState(0);
    const [subtasks, setSubtasks] = useState([]);
    const modalRef = useRef(null);

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

    useEffect(() => {
        const updateBorderHeight = () => {
            if (modalRef.current) {
                const modalContent = modalRef.current;
                const border = modalContent.querySelector('.AddTaskModal-border');
                requestAnimationFrame(() => {
                    const contentHeight = modalContent.scrollHeight;
                    border.style.height = `${contentHeight - 30}px`; // 30px برای فاصله 15px از بالا و پایین
                });
            }
        };

        updateBorderHeight();
        window.addEventListener('resize', updateBorderHeight);
        return () => window.removeEventListener('resize', updateBorderHeight);
    }, [subtaskCount, showAdvanced, subtasks]);

    if (!isOpen) return <></>;

    return (
        <div className="AddTaskModal" ref={modalRef}>
            <div className="AddTaskModal-border"></div>
            <span className="AddTaskModal-title">افزودن تسک</span>
            <form action="" className="AddTaskModal-form">
                <div className="form-group">
                    <label>نام</label>
                    <input type="text" />
                </div>
                <div className="form-group">
                    <label>توضیحات</label>
                    <textarea className="form-control" rows="1" />
                </div>
                <div className="d-flex justify-content-between gap-3">
                    <div className="form-group flex-grow-1">
                        <label>ساعت</label>
                        <input type="time" className="form-control" />
                    </div>
                    <div className="form-group flex-grow-1">
                        <label>تاریخ انقضا</label>
                        <input type="date" className="form-control" />
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-outline secondary mt-3"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? 'بستن گزینه‌های بیشتر' : 'گزینه‌های بیشتر'}
                </button>
                {showAdvanced && (
                    <div className="mt-3">
                        <label>این کارت رو به چند قسمت تقسیم می‌کنی؟</label>
                        <div className="d-flex align-items-center gap-2 my-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={decreaseCount}
                            >
                                -
                            </button>
                            <span>{subtaskCount}</span>
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={increaseCount}
                            >
                                +
                            </button>
                        </div>

                        {subtasks.map((value, index) => (
                            <div className="form-group" key={index}>
                                <label>نام ساب‌تسک {index + 1}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={value}
                                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                        بستن
                    </button>
                    <button type="submit" className="btn btn-primary">
                        ذخیره تسک
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTaskModal;
