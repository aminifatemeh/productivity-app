import React, { useState } from "react";
import "./MiniTaskManagement.scss";

const MOCK_TASKS = [
    {
        id: 1,
        title: "آماده‌سازی برای امتحان ریاضی",
        description: "فصل‌های ۳ تا ۶ رو مرور کن",
        deadline: "۱۴۰۴/۰۳/۱۵",
        tags: [
            { name: "درسی", color: "#38A3A5" },
            { name: "مهم", color: "#FF6B6B" },
        ],
        subtasks: [
            { title: "فصل ۳", isDone: true },
            { title: "فصل ۴", isDone: true },
            { title: "فصل ۵", isDone: false },
            { title: "فصل ۶", isDone: false },
        ],
        isDone: false,
    },
    {
        id: 2,
        title: "پروژه گروهی شیمی",
        description: "تهیه گزارش آزمایشگاه",
        deadline: "۱۴۰۴/۰۳/۲۰",
        tags: [{ name: "گروهی", color: "#57CC99" }],
        subtasks: [
            { title: "جمع‌آوری داده‌ها", isDone: true },
            { title: "نوشتن گزارش", isDone: false },
        ],
        isDone: false,
    },
    {
        id: 3,
        title: "مطالعه فصل ادبیات",
        description: "شعرهای حفظی رو مرور کن",
        deadline: null,
        tags: [{ name: "درسی", color: "#38A3A5" }],
        subtasks: [],
        isDone: true,
    },
];

// ── Mini Progress Bar ─────────────────────────────────────
function MiniProgressBar({ progress }) {
    return (
        <div className="mtm-progress">
            <div className="mtm-progress__fill" style={{ width: `${progress}%` }} />
        </div>
    );
}

// ── Mini Task Card ────────────────────────────────────────
function MiniTaskCard({ task }) {
    const [expanded, setExpanded] = useState(false);
    const doneCount = task.subtasks.filter((s) => s.isDone).length;
    const progress = task.isDone
        ? 100
        : task.subtasks.length === 0
            ? 0
            : Math.round((doneCount / task.subtasks.length) * 100);

    return (
        <div
            className={`mtm-card ${task.isDone ? "is-done" : ""} ${expanded ? "is-expanded" : ""}`}
            onClick={() => task.subtasks.length > 0 && setExpanded(!expanded)}
        >
            <div className="mtm-card__body">
                <div className="mtm-card__titles">
                    <span className="mtm-card__title">{task.title}</span>
                    <span className="mtm-card__desc">{task.description}</span>
                    {task.deadline && (
                        <span className="mtm-card__deadline">تاریخ انقضا: {task.deadline}</span>
                    )}
                </div>
                <div className="mtm-card__actions">
                    {/* آیکون‌ها — static */}
                    <div className="mtm-card__icons">
                        <span className="mtm-card__icon mtm-card__icon--edit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                        <span className="mtm-card__icon mtm-card__icon--delete">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </span>
                        <span className={`mtm-card__icon mtm-card__icon--done ${task.isDone ? "is-done" : ""}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </div>
                    {/* Tags */}
                    <div className="mtm-card__tags">
                        {task.tags.map((tag) => (
                            <span
                                key={tag.name}
                                className="mtm-card__tag"
                                style={{ backgroundColor: tag.color }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mtm-card__divider" />

            {/* Subtasks — وقتی expanded */}
            {expanded && task.subtasks.length > 0 && (
                <div className="mtm-card__subtasks">
                    {task.subtasks.map((sub, i) => (
                        <div key={i} className={`mtm-subtask ${sub.isDone ? "is-done" : ""}`}>
                            <div className="mtm-subtask__check">
                                {sub.isDone && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                )}
                            </div>
                            <span className="mtm-subtask__title">{sub.title}</span>
                        </div>
                    ))}
                </div>
            )}

            <MiniProgressBar progress={progress} />
        </div>
    );
}

// ── Add Task Button ───────────────────────────────────────
function AddTaskButton() {
    return (
        <div className="mtm-add-btn">
            <div className="mtm-add-btn__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
            </div>
            <span className="mtm-add-btn__text">افزودن تسک جدید</span>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────
function MiniTaskManagement() {
    return (
        <div className="mini-task-management" dir="rtl">
            <div className="mtm-list">
                {MOCK_TASKS.map((task) => (
                    <MiniTaskCard key={task.id} task={task} />
                ))}
            </div>
            <AddTaskButton />
        </div>
    );
}

export default MiniTaskManagement;