import React from "react";
import './TasksSection.scss';

const DustIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="19" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M19 15.5V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const DeskIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="7" width="20" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M5 10v8M19 10v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M5 15h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.4"/>
    </svg>
);

const QueueIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CARDS = [
    {
        label:    "رومیز",
        icon:     <DeskIcon />,
        gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
        title:    "کارهای امروز",
        desc:     "کارهای مربوط به امروز رو در بخش رومیز مدیریت کن. تمرکزت رو روی همین لحظه بذار.",
        bullets:  ["اولویت‌بندی کارهای روز", "تمرکز روی همین لحظه", "پیگیری پیشرفت لحظه‌ای"],
    },
    {
        label:    "نوبتش میشه",
        icon:     <QueueIcon />,
        gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
        title:    "کارهای آینده",
        desc:     "کارهایی که قراره در آینده بهشون سر و سامون بدی. سر وقتشون یادت میاد.",
        bullets:  ["زمان‌بندی دقیق برای آینده", "یادآوری خودکار سر وقت", "آماده‌سازی بدون استرس"],
    },
    {
        label:    "خاک خورده",
        icon:     <DustIcon />,
        gradient: "linear-gradient(135deg, #80ED99 0%, #96F5AF 100%)",
        title:    "کارهای از قبل مونده",
        desc:     "کارهایی که عقب افتادن گم نمیشن! اینجا مدیریتشون کن و بالاخره انجامشون بده.",
        bullets:  ["هیچ کاری فراموش نمیشه", "مرتب‌سازی بر اساس تاخیر", "انگیزه برای تموم کردن"],
    },
];

function TasksSection() {
    return (
        <section className="section lp-section--tasks" id="tasks">
            <div className="lp-section-container">
                <h2 className="lp-section-title">کارهاتو دسته‌بندی کن</h2>
                <p className="lp-section-subtitle">سه بخش هوشمند برای هر نوع کاری که داری</p>

                <div className="lp-tasks-grid">
                    {CARDS.map(({label, icon, gradient, title, desc, bullets}) => (
                        <div key={label} className="lp-tsc" style={{"--card-gradient": gradient}}>
                            <div className="lp-tsc__header">
                                <div className="lp-tsc__header-left">
                                    <div className="lp-tsc__icon">{icon}</div>
                                    <span className="lp-tsc__label">{label}</span>
                                </div>
                            </div>
                            <div className="lp-tsc__body">
                                <h3 className="lp-tsc__title">{title}</h3>
                                <p className="lp-tsc__desc">{desc}</p>
                                <ul className="lp-tsc__bullets">
                                    {bullets.map((b) => <li key={b}>{b}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
}

export default TasksSection;