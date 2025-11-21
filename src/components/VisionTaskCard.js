// components/VisionTaskCard.js
import React from 'react';
import './VisionTaskCard.scss';

function VisionTaskCard({ task, onEdit, onView }) {
    const hasSubtasks = task.subtasks && Array.isArray(task.subtasks) && task.subtasks.length > 0;
    const hasTags = task.tags && Array.isArray(task.tags) && task.tags.length > 0;

    console.log('VisionTaskCard - Task:', task); // برای دیباگ

    return (
        <div className="VisionTaskCard">
            <div className="VisionTaskCard__description">
                <div className="VisionTaskCard__description-titles">
                    <span>{task.title || 'بدون عنوان'}</span>
                    {task.description && <span>{task.description}</span>}
                    {task.deadline_date && <span>تاریخ انقضا: {task.deadline_date}</span>}
                </div>
                <div className="VisionTaskCard__description-labels">
                    <div className="task-icons">
                        {onView && (
                            <img
                                src="/assets/icons/view.svg"
                                alt="نمایش"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView();
                                }}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                        {onEdit && (
                            <img
                                src="/assets/icons/edit.svg"
                                alt="ویرایش"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </div>
                    {hasTags && (
                        <div className="task-label">
                            {task.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="task-tag"
                                    style={{
                                        backgroundColor: tag.color || "#D9D9D9",
                                    }}
                                >
                                    {tag.name || 'بدون نام'}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {hasSubtasks && (
                <>
                    <div className="VisionTaskCard__divider" />
                    <div className="VisionTaskCard__expanded-area">
                        {task.subtasks.map((subtask, index) => (
                            <div key={subtask.id || index} className="subtask-item">
                                <span className={subtask.isDone ? 'done' : ''}>
                                    {subtask.title || `زیرتسک ${index + 1}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default VisionTaskCard;