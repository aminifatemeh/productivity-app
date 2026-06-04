import React from "react";
import MiniTaskManagement from "./MiniTaskManagement";
import './TaskFeaturesSection.scss';



const FEATURES = [
    { emoji: "🔀", title: "تسک‌های چند بخشی",  desc: "اگه کاری چند مرحله داره، روند پیشرفت و تکمیل شدنش رو ببین" },
    { emoji: "🏷️", title: "دسته‌بندی و برچسب", desc: "کارهات رو دسته‌بندی کن و برچسب بزن تا راحت‌تر پیداشون کنی" },
    { emoji: "🔁", title: "روتین و عادت",        desc: "عادت‌های روزانه و هفتگی بساز و پیگیریشون کن" },
    { emoji: "📅", title: "تقویم شمسی",          desc: "همه کارها با تاریخ شمسی مدیریت میشن" },
    { emoji: "⏰", title: "یادآوری به موقع",     desc: "کارهای آینده سر وقتشون بهت یادآوری میشن" },
    { emoji: "📊", title: "گزارش عملکرد",        desc: "گزارش روزانه، هفتگی و ماهانه از کارهایی که انجام دادی" },
];

function TaskFeaturesSection() {
    return (
        <section className="section section--task-features" id="task-features">
            <div className="section-container">
                <h2 className="section-title">یه عالمه قابلیت برای ایجاد تسک</h2>
                <p className="section-subtitle">هر نوع کاری که داری، یار پلنر پشتیبانیش می‌کنه</p>

                {/* Features + Visual در یه layout کنار هم */}
                <div className="tf-split">
                    <div className="tf-split__features">
                        {FEATURES.map((item, i) => (
                            <div key={i} className="tf-feature-item">
                                <span className="tf-feature-item__emoji">{item.emoji}</span>
                                <div>
                                    <h4 className="tf-feature-item__title">{item.title}</h4>
                                    <p className="tf-feature-item__desc">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="tf-split__visual">
                        <MiniTaskManagement />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TaskFeaturesSection;