import React from "react";
import SectionPlaceholder from "./SectionPlaceholder";
import './TaskFeaturesSection.scss';

const TaskPlusIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const FEATURES = [
    { emoji: "🔀", title: "تسک‌های چند بخشی",   desc: "اگه کاری چند مرحله داره، روند پیشرفت و تکمیل شدنش رو ببین" },
    { emoji: "🏷️", title: "دسته‌بندی و برچسب",  desc: "کارهات رو دسته‌بندی کن و برچسب بزن تا راحت‌تر پیداشون کنی" },
    { emoji: "🔁", title: "روتین و عادت",         desc: "عادت‌های روزانه و هفتگی بساز و پیگیریشون کن" },
    { emoji: "📅", title: "تقویم شمسی",           desc: "همه کارها با تاریخ شمسی مدیریت میشن" },
    { emoji: "⏰", title: "یادآوری به موقع",      desc: "کارهای آینده سر وقتشون بهت یادآوری میشن" },
    { emoji: "📊", title: "گزارش عملکرد",         desc: "گزارش روزانه، هفتگی و ماهانه از کارهایی که انجام دادی" },
];

function TaskFeaturesSection() {
    return (
        <section className="section section--task-features" id="task-features">
            <div className="section-container">
                <div className="section-tag section-tag--center">
                    <TaskPlusIcon />
                    ایجاد تسک
                </div>
                <h2 className="section-title">یه عالمه قابلیت برای ایجاد تسک</h2>
                <p className="section-subtitle">هر نوع کاری که داری، یار پلنر پشتیبانیش می‌کنه</p>

                <div className="task-features-grid">
                    {FEATURES.map((item, i) => (
                        <div key={i} className="task-feature-item">
                            <span className="task-feature-item__emoji">{item.emoji}</span>
                            <h4 className="task-feature-item__title">{item.title}</h4>
                            <p className="task-feature-item__desc">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <SectionPlaceholder
                    name="TASK_MANAGEMENT_VISUAL"
                    hint="المان از TaskManagementPage اینجا قرار می‌گیره"
                />
            </div>
        </section>
    );
}

export default TaskFeaturesSection;