// components/VisionTaskCard.js
import React from 'react';
import './VisionTaskCard.scss';

function VisionTaskCard({ task, onEdit, onView }) {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    return (
        <div className="VisionTaskCard">
            <div className="VisionTaskCard__description">
                <div className="VisionTaskCard__description-titles">
                    <span>{task.title}</span>
                    <span>{task.description}</span>
                    {task.deadline_date && <span>تاریخ انقضا: {task.deadline_date}</span>}
                </div>
                <div className="VisionTaskCard__description-labels">
                    <div className="task-icons">
                        {onView && (
                            <img
                                src="/assets/icons/trash-bin.svg"
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
                    <div className="task-label">
                        {task.tags && task.tags.length > 0 ? (
                            task.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="task-tag"
                                    style={{
                                        backgroundColor: tag.color || "#D9D9D9",
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>

            {hasSubtasks && (
                <>
                    <div className="VisionTaskCard__divider" />
                    <div className="VisionTaskCard__expanded-area">
                        {task.subtasks.map((subtask) => (
                            <div key={subtask.id} className="subtask-item">
                                <span className={subtask.isDone ? 'done' : ''}>
                                    {subtask.title}
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