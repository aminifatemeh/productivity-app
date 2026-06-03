import React from "react";
import SectionPlaceholder from "./SectionPlaceholder";
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

function TasksSection() {
    return (
        <section className="section section--tasks" id="tasks">
            <div className="section-container">
                <h2 className="section-title">کارهاتو دسته‌بندی کن</h2>
                <p className="section-subtitle">سه بخش هوشمند برای هر نوع کاری که داری</p>

                <div className="tasks-grid">
                    <div className="task-section-card task-section-card--desk">
                        <div className="task-section-card__icon">
                            <DeskIcon />
                        </div>
                        <div className="task-section-card__content">
                            <span className="task-section-card__label">رومیز</span>
                            <h3>کارهای امروز</h3>
                            <p>کارهای مربوط به امروز رو در بخش رومیز مدیریت کن. تمرکزت رو روی همین لحظه بذار.</p>
                        </div>
                        <SectionPlaceholder
                            name="TASK_CARD_ACTIVE"
                            hint="TaskPreviewCard با variant='active' اینجا"
                        />
                    </div>

                    <div className="task-section-card task-section-card--queue">
                        <div className="task-section-card__icon">
                            <QueueIcon />
                        </div>
                        <div className="task-section-card__content">
                            <span className="task-section-card__label">نوبتش میشه</span>
                            <h3>کارهای آینده</h3>
                            <p>کارهایی که قراره در آینده بهشون سر و سامون بدی. سر وقتشون یادت میاد.</p>
                        </div>
                        <SectionPlaceholder
                            name="TASK_CARD_UPNEXT"
                            hint="TaskPreviewCard با variant='upNext' اینجا"
                        />
                    </div>

                    <div className="task-section-card task-section-card--dust">
                        <div className="task-section-card__icon">
                            <DustIcon />
                        </div>
                        <div className="task-section-card__content">
                            <span className="task-section-card__label">خاک خورده</span>
                            <h3>کارهای از قبل مونده</h3>
                            <p>کارهایی که عقب افتادن گم نمیشن! اینجا مدیریتشون کن و بالاخره انجامشون بده.</p>
                        </div>
                        <SectionPlaceholder
                            name="TASK_CARD_ARCHIVED"
                            hint="TaskPreviewCard با variant='archived' اینجا"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TasksSection;