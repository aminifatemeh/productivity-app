// TaskPreviewCardMock.jsx
import React from "react";
import "../dashboard/TaskPreviewCard.scss";

const KhakKhordeIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="1.2" fill="white"/>
        <line x1="12" y1="12" x2="12" y2="3" stroke="white" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="19.5" y2="7.5" stroke="white" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="19.5" y2="16.5" stroke="white" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="12" y2="21" stroke="white" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="4.5" y2="16.5" stroke="white" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="4.5" y2="7.5" stroke="white" strokeWidth="1.2"/>
        <path d="M12 6 Q15.5 9 15.5 12 Q15.5 15 12 18 Q8.5 15 8.5 12 Q8.5 9 12 6Z" stroke="white" strokeWidth="1" fill="none"/>
        <path d="M12 3.5 Q18 7.5 18 12 Q18 16.5 12 20.5 Q6 16.5 6 12 Q6 7.5 12 3.5Z" stroke="white" strokeWidth="1" fill="none"/>
    </svg>
);

const NobateshMisheIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="10" width="20" height="2.5" rx="1.2" stroke="white" strokeWidth="1.5"/>
        <line x1="6" y1="12.5" x2="5" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="18" y1="12.5" x2="19" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5.3" y1="17" x2="18.7" y2="17" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
);

const RumizIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <line x1="7" y1="3" x2="17" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7" y1="21" x2="17" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 3 C8 3 8 8 12 12 C16 16 16 21 16 21" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M16 3 C16 3 16 8 12 12 C8 16 8 21 8 21" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M9.5 19.5 Q12 17.5 14.5 19.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
);

const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5 3L13 8L5 13V3Z"/>
    </svg>
);

const mockData = {
    active: {
        label: "رومیز",
        gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
        icon: <RumizIcon />,
        tasks: [
            { id: "1", title: "طراحی صفحه داشبورد", time: "01:24" },
            { id: "2", title: "بررسی فیدبک‌های کاربران", time: "00:45" },
            { id: "3", title: "جلسه هماهنگی تیم", time: null },
            { id: "4", title: "نوشتن مستندات API", time: "00:32" },
            { id: "5", title: "رفع باگ فرم ورود", time: null },
        ],
    },
    upNext: {
        label: "نوبتش میشه",
        gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
        icon: <NobateshMisheIcon />,
        tasks: [
            { id: "6", title: "پیاده‌سازی فیلتر جستجو", time: null },
            { id: "7", title: "بهینه‌سازی کوئری‌های دیتابیس", time: null },
            { id: "8", title: "طراحی آیکون‌های جدید", time: null },
            { id: "9", title: "تست واحد برای سرویس پرداخت", time: null },
        ],
    },
    archived: {
        label: "خاک خورده",
        gradient: "linear-gradient(135deg, #80ED99 0%, #96F5AF 100%)",
        icon: <KhakKhordeIcon />,
        tasks: [
            { id: "10", title: "ریفکتور ماژول احراز هویت", time: "03:10" },
            { id: "11", title: "بررسی رقبا و آنالیز بازار", time: "01:55" },
            { id: "12", title: "به‌روزرسانی کتابخانه‌های قدیمی", time: "02:20" },
        ],
    },
};

function TaskPreviewCardMock({ cardName = "active" }) {
    const config = mockData[cardName] || mockData.active;

    return (
        <div className="task-preview__card" style={{ background: config.gradient }}>
            <div className="task-preview__card-header">
                <div className="header-content">
                    <div className="header-icon">{config.icon}</div>
                    <span className="header-title">{config.label}</span>
                </div>
                <div className="task-count-badge">{config.tasks.length}</div>
            </div>

            <div className="task-preview__card-tasks">
                {config.tasks.map((task) => (
                    <div
                        key={task.id}
                        className="task-preview__card-task"
                        style={{ "--progress": "0%" }}
                    >
                        <div className="task-content">
                            <div className="task-indicator"></div>
                            <div className="task-info">
                <span className="task-title" title={task.title}>
                  {task.title}
                </span>
                                {task.time && (
                                    <span className="task-time">{task.time}</span>
                                )}
                            </div>
                        </div>
                        <button
                            className="task-action-btn"
                            aria-label="Play"
                            onClick={(e) => e.preventDefault()}
                        >
                            <PlayIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskPreviewCardMock;
