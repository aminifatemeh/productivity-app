import React from "react";
import "./MiniCharts.scss";

// ── Static mock data ──────────────────────────────────────
const WEEK_DATA = [
    { day: "شنبه",     done: 3, undone: 1 },
    { day: "یکشنبه",   done: 2, undone: 2 },
    { day: "دوشنبه",   done: 5, undone: 0 },
    { day: "سه‌شنبه",  done: 1, undone: 3 },
    { day: "چهارشنبه", done: 4, undone: 1 },
    { day: "پنجشنبه",  done: 6, undone: 0 },
    { day: "جمعه",     done: 3, undone: 2, isToday: true },
];

const FOCUS_CARDS = [
    { label: "امروز",  percentage: 72,  color: "#38A3A5", duration: "۵ ساعت ۴۵ دقیقه" },
    { label: "هفتگی",  percentage: 58,  color: "#57CC99", duration: "۳۲ ساعت ۲۰ دقیقه" },
    { label: "ماهانه", percentage: 43,  color: "#80ED99", duration: "۱۰۴ ساعت" },
];

const TODAY_PERF = { percentage: 78, completed: 7 };

// ── Helpers ───────────────────────────────────────────────
const getDonutStyle = (percentage) => {
    const r = 65;
    const circ = 2 * Math.PI * r;
    return {
        strokeDasharray: `${circ} ${circ}`,
        strokeDashoffset: circ - (percentage / 100) * circ,
    };
};

const BAR_MAX = 7; // max tasks در یه روز برای scale

// ── Sub-components ────────────────────────────────────────
function FocusDonut({ label, percentage, color, duration }) {
    const r = 65;
    const circ = 2 * Math.PI * r;
    return (
        <div className="mc-focus-card">
            <div className="mc-focus-card__header">
                <h4 className="mc-focus-card__title">تمرکز {label}</h4>
                <p className="mc-focus-card__sub">زمان صرف شده</p>
            </div>
            <div className="mc-focus-card__chart">
                <svg viewBox="0 0 160 160" className="mc-donut">
                    <circle cx="80" cy="80" r={r} fill="none" stroke="#E8F5E9" strokeWidth="14"/>
                    <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="14"
                            strokeLinecap="round"
                            style={getDonutStyle(percentage)}
                            transform="rotate(-90 80 80)"/>
                    <text x="80" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2C868B">
                        {percentage}%
                    </text>
                    <text x="80" y="95" textAnchor="middle" fontSize="10" fill="#7C7C7C">
                        {duration}
                    </text>
                </svg>
            </div>
        </div>
    );
}

function WeekBarChart() {
    return (
        <div className="mc-bar-chart">
            <div className="mc-bar-chart__header">
                <h4 className="mc-bar-chart__title">پیشرفت هفتگی</h4>
                <div className="mc-bar-chart__legend">
                    <span className="mc-legend-dot mc-legend-dot--done"/> انجام شده
                    <span className="mc-legend-dot mc-legend-dot--undone"/> انجام نشده
                </div>
            </div>
            <div className="mc-bar-chart__bars">
                {WEEK_DATA.map(({ day, done, undone, isToday }) => {
                    const total = done + undone;
                    const doneH  = (done   / BAR_MAX) * 100;
                    const undoneH = (undone / BAR_MAX) * 100;
                    return (
                        <div key={day} className={`mc-bar-col ${isToday ? "is-today" : ""}`}>
                            <div className="mc-bar-stack">
                                {undone > 0 && (
                                    <div
                                        className="mc-bar mc-bar--undone"
                                        style={{ height: `${undoneH}%` }}
                                        title={`انجام نشده: ${undone}`}
                                    />
                                )}
                                {done > 0 && (
                                    <div
                                        className="mc-bar mc-bar--done"
                                        style={{ height: `${doneH}%` }}
                                        title={`انجام شده: ${done}`}
                                    />
                                )}
                            </div>
                            <span className="mc-bar-label">{day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────
function MiniCharts() {
    return (
        <div className="mini-charts" dir="rtl">
            {/* Focus donuts — سه تا کنار هم */}
            <div className="mc-focus-row">
                {FOCUS_CARDS.map((card) => (
                    <FocusDonut key={card.label} {...card} />
                ))}
            </div>

            {/* Bar chart هفتگی */}
            <WeekBarChart />
        </div>
    );
}

export default MiniCharts;