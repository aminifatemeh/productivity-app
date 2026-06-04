import React from "react";
import './AudienceSection.scss';

const StudentIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 8l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M6 10.5v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M22 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const UniversityIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M5 21V9l7-6 7 6v12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const GrowthIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M3 17l4-4 4 4 4-6 4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 7l-4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="21" cy="7" r="1.5" fill="currentColor"/>
    </svg>
);

function AudienceSection() {
    return (
        <section className="section section--audience" id="audience">
            <div className="section-container">
                <h2 className="section-title">این اپ مناسب چه کساییه؟</h2>
                <p className="section-subtitle">یار پلنر برای هر کسی که می‌خواد زندگیش رو منظم‌تر کنه طراحی شده</p>

                <div className="audience-grid">
                    <div className="audience-card">
                        <div className="audience-card__icon">
                            <StudentIcon />
                        </div>
                        <h3 className="audience-card__title">دانش‌آموزها</h3>
                        <ul className="audience-card__list">
                            <li>مدیریت درس و مباحث</li>
                            <li>برنامه‌ریزی برای امتحانات</li>
                            <li>پیگیری تکالیف</li>
                        </ul>
                    </div>

                    <div className="audience-card">
                        <div className="audience-card__icon">
                            <UniversityIcon />
                        </div>
                        <h3 className="audience-card__title">دانشجوها</h3>
                        <ul className="audience-card__list">
                            <li>مدیریت پروژه‌های درسی</li>
                            <li>برنامه‌ریزی کلاس‌ها و رویدادها</li>
                            <li>آماده‌سازی برای امتحانات</li>
                        </ul>
                    </div>

                    <div className="audience-card">
                        <div className="audience-card__icon">
                            <GrowthIcon />
                        </div>
                        <h3 className="audience-card__title">هر کسی که می‌خواد رشد کنه</h3>
                        <ul className="audience-card__list">
                            <li>نظم دادن به زندگی روزمره</li>
                            <li>ساختن عادت‌های مثبت</li>
                            <li>رسیدن به اهداف بلندمدت</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AudienceSection;