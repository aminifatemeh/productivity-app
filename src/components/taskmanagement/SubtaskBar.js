import React from 'react';
import './SubtaskBar.scss';

function SubtaskBar({ className = '', onDelete, isDone, onToggle, title }) {
    const handleToggleDone = (e) => {
        e.stopPropagation();
        onToggle?.();
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.();
    };

    return (
        <div className={`subtaskbar ${className} ${isDone ? "done" : "not-done"}`}>
            <div className="subtaskbar__left">
                <button
                    type="button"
                    className="subtaskbar__check"
                    onClick={handleToggleDone}
                    aria-label="تکمیل زیرکار"
                >
                    {isDone && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </button>
                <span className="subtaskbar__title">{title}</span>
            </div>
            <button
                type="button"
                className="subtaskbar__delete"
                onClick={handleDelete}
                aria-label="حذف زیرکار"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    );
}

export default SubtaskBar;
