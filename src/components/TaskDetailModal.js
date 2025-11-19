// components/TaskDetailModal.js
import React from 'react';
import './TaskDetailModal.scss';
import moment from 'jalali-moment';

const TaskDetailModal = ({ isOpen, onClose, task }) => {
    if (!isOpen) return null;

    const formatDate = (date) => {
        if (!date) return 'ندارد';
        return moment(date, 'YYYY-MM-DD').locale('fa').format('jYYYY/jMM/jDD');
    };

    return (
        <div className="task-detail-modal-overlay" onClick={onClose}>
            <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>جزئیات تسک</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="detail-row">
                        <span className="label">عنوان:</span>
                        <span className="value">{task.title || '—'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">توضیحات:</span>
                        <span className="value">{task.description || 'ندارد'}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">تاریخ انقضا:</span>
                        <span className="value">{formatDate(task.deadline_date)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">ساعت:</span>
                        <span className="value">{task.hour || 'ندارد'}</span>
                    </div>

                    {task.subtasks?.length > 0 && (
                        <div className="detail-row subtasks">
                            <span className="label">زیرتسک‌ها:</span>
                            <ul>
                                {task.subtasks.map((sub, i) => (
                                    <li key={sub.id || i}>
                                        {sub.title} {sub.isDone ? '(انجام شده)' : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;