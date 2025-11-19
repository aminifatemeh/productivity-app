// components/VisionTaskCard.js
import React from 'react';
import './VisionTaskCard.scss';
import SubtaskBar from './SubtaskBar';

function VisionTaskCard({ task }) {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    return (
        <div className={`vision-task-card ${hasSubtasks ? 'has-subtasks' : ''}`}>
            <div className="vision-task-card__description">
                <div className="vision-task-card__description-titles">
                    <span className="task-title">{task.title}</span>
                    <span className="task-description">{task.description}</span>
                </div>
                <div className="vision-task-card__description-labels">
                    <div className="task-label">
                        {task.tags && task.tags.length > 0 ? (
                            task.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="task-tag"
                                    style={{
                                        backgroundColor: tag.color || '#D9D9D9',
                                    }}
                                >
                                    {tag.name}
                                </span>
                            ))
                        ) : null}
                    </div>
                </div>
            </div>

            {hasSubtasks && (
                <>
                    <div className="vision-task-card__divider" />
                    <div className="vision-task-card__expanded-area">
                        {task.subtasks.map((subtask) => (
                            <div key={subtask.id} className="w-100">
                                <SubtaskBar
                                    title={subtask.title}
                                    isDone={subtask.isDone}
                                    onToggle={null}
                                    onDelete={null}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default VisionTaskCard;