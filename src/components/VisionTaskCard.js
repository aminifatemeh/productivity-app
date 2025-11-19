// components/VisionTaskCard.js
import React from 'react';
import './VisionTaskCard.scss';

function VisionTaskCard({ task, onEdit }) {
    return (
        <div className="vision-task-card">
            <div className="vision-card-header">
                <h3 className="vision-task-title">{task.title}</h3>
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="vision-edit-btn"
                        title="ویرایش تسک"
                    >
                        Edit
                    </button>
                )}
            </div>

            {task.description && (
                <p className="vision-task-description">{task.description}</p>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
                <ul className="vision-subtasks">
                    {task.subtasks.map(sub => (
                        <li key={sub.id} className={sub.isDone ? 'done' : ''}>
                            {sub.title}
                        </li>
                    ))}
                </ul>
            )}

            {task.tags && task.tags.length > 0 && (
                <div className="vision-tags">
                    {task.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="vision-tag"
                            style={{ backgroundColor: tag.color || '#888' }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VisionTaskCard;