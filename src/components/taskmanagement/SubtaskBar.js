import React from 'react';
import './SubtaskBar.scss';
import { SubtaskCheckIcon, SubtaskDeleteIcon } from '../Icons';


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
                    {isDone && <SubtaskCheckIcon />}
                </button>
                <span className="subtaskbar__title">{title}</span>
            </div>
            <button
                type="button"
                className="subtaskbar__delete"
                onClick={handleDelete}
                aria-label="حذف زیرکار"
            >
                <SubtaskDeleteIcon />
            </button>
        </div>
    );
}

export default SubtaskBar;
