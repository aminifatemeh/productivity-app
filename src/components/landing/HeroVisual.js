import React from "react";
import "./HeroVisual.scss";

// ── Static mock data ──────────────────────────────────────
const MOCK_TASKS = {
    active: [
        { id: 1, title: "مطالعه فصل ۳ فیزیک", time: "۴۵:۱۲", running: true },
        { id: 2, title: "حل تمرین‌های ریاضی", time: "۲۲:۰۵", running: false },
        { id: 3, title: "یادداشت‌برداری زیست", time: null, running: false },
    ],
    upNext: [
        { id: 4, title: "مرور فصل ادبیات", time: null, running: false },
        { id: 5, title: "پروژه گروهی شیمی", time: null, running: false },
    ],
};

// ── Mini Pomodoro ─────────────────────────────────────────
function MiniPomodoro({ seconds, isRunning }) {
    const progress = Math.min((seconds % 1500) / 1500 * 100, 100);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const conicBg = isRunning
        ? `conic-gradient(#2C868B ${progress}%, #5ecea8 ${progress}% 100%)`
        : "linear-gradient(135deg, #5ecea8 0%, #2C868B 100%)";

    return (
        <div className="hv-pomodoro">
            <div className="hv-pomodoro__ring" style={{ background: conicBg }}>
                <div className="hv-pomodoro__inner">
                    <span className="hv-pomodoro__time">{timeStr}</span>
                    <span className="hv-pomodoro__label">تمرکز</span>
                </div>
            </div>
            <div className="hv-pomodoro__controls">
                <button className={`hv-pomodoro__btn ${isRunning ? "is-running" : ""}`}>
                    {isRunning ? (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="3" y="2" width="3.5" height="12" rx="1"/>
                            <rect x="9.5" y="2" width="3.5" height="12" rx="1"/>
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5 3L13 8L5 13V3Z"/>
                        </svg>
                    )}
                </button>
                <button className="hv-pomodoro__btn hv-pomodoro__btn--stop">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="3" y="3" width="10" height="10" rx="1.5"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}

// ── Mini Task Card ────────────────────────────────────────
function MiniTaskCard({ variant, tasks }) {
    const configs = {
        active: {
            gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
            label: "رومیز",
        },
        upNext: {
            gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
            label: "نوبتش میشه",
        },
    };
    const cfg = configs[variant];

    return (
        <div className="hv-taskcard" style={{ background: cfg.gradient }}>
            <div className="hv-taskcard__header">
                <span className="hv-taskcard__label">{cfg.label}</span>
                <span className="hv-taskcard__count">{tasks.length}</span>
            </div>
            <div className="hv-taskcard__list">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`hv-taskcard__item ${task.running ? "is-running" : ""}`}
                    >
                        <div className="hv-taskcard__dot" />
                        <span className="hv-taskcard__title">{task.title}</span>
                        {task.time && (
                            <span className="hv-taskcard__time">{task.time}</span>
                        )}
                        <button className={`hv-taskcard__play ${task.running ? "is-running" : ""}`}>
                            {task.running ? (
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                                    <rect x="3" y="2" width="3.5" height="12" rx="1"/>
                                    <rect x="9.5" y="2" width="3.5" height="12" rx="1"/>
                                </svg>
                            ) : (
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M5 3L13 8L5 13V3Z"/>
                                </svg>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main HeroVisual ───────────────────────────────────────
function HeroVisual() {
    const seconds = 312;


    return (
        <div className="hero-visual-wrap" aria-hidden="true">
            {/* Decorative glow behind everything */}
            <div className="hv-glow" />

            {/* Pomodoro — top center, prominent */}
            <div className="hv-slot hv-slot--pomodoro">
                <MiniPomodoro seconds={seconds} isRunning={true} />
            </div>

            {/* Active tasks card — bottom left */}
            <div className="hv-slot hv-slot--active">
                <MiniTaskCard variant="active" tasks={MOCK_TASKS.active} />
            </div>

            {/* UpNext card — bottom right */}
            <div className="hv-slot hv-slot--upnext">
                <MiniTaskCard variant="upNext" tasks={MOCK_TASKS.upNext} />
            </div>

            {/* Floating stat pill */}
            <div className="hv-pill hv-pill--streak">
                <span className="hv-pill__emoji">🔥</span>
                <span className="hv-pill__text">۷ روز متوالی</span>
            </div>

            <div className="hv-pill hv-pill--done">
                <span className="hv-pill__emoji">✅</span>
                <span className="hv-pill__text">۵ تسک امروز</span>
            </div>
        </div>
    );
}

export default HeroVisual;