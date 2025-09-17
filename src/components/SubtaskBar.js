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
            <span>{title}</span>
            <div className="d-flex justify-content-center align-items-center gap-1">
                <img
                    src="/assets/icons/trash-bin.svg"
                    alt="delete"
                    onClick={handleDelete}
                />
                <img
                    src={isDone ? "/assets/icons/green-tick.svg" : "/assets/icons/gray-tick.svg"}
                    alt="Done"
                    onClick={handleToggleDone}
                />
            </div>
        </div>
    );
}

export default SubtaskBar;