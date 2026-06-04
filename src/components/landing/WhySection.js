import React from "react";
import SectionPlaceholder from "./SectionPlaceholder";
import './Whysection.scss';

const OfflineIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
);

const CalendarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <text x="7" y="19" fontSize="7" fill="currentColor" fontWeight="bold">۱۴</text>
    </svg>
);

const WebIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M3.6 7.5h16.8M3.6 16.5h16.8" stroke="currentColor" strokeWidth="1.4" opacity="0.5"/>
    </svg>
);

function WhySection() {
    return (
        <section className="section section--why" id="why">
            <div className="section-container">
                <h2 className="section-title">چرا یار پلنر؟</h2>

                <div className="why-grid">
                    <div className="why-card">
                        <div className="why-card__icon" style={{ color: "#38A3A5" }}>
                            <OfflineIcon />
                        </div>
                        <div className="why-card__content">
                            <h3>باز اینترنت قطعه؟ مشکلی نیست!</h3>
                            <p>با نت ملی هم در دسترسیم. یار پلنر روی زیرساخت داخلی کار می‌کنه و قطعی اینترنت بین‌الملل مشکلی ایجاد نمی‌کنه.</p>
                        </div>
                    </div>

                    <div className="why-card">
                        <div className="why-card__icon" style={{ color: "#57CC99" }}>
                            <CalendarIcon />
                        </div>
                        <div className="why-card__content">
                            <h3>تقویم شمسی بومی</h3>
                            <p>دیگه لازم نیست حساب کنی ۲۰ می چندم خرداده! همه چیز با تاریخ شمسی نشون داده میشه.</p>
                        </div>
                    </div>

                    <div className="why-card">
                        <div className="why-card__icon" style={{ color: "#80ED99" }}>
                            <WebIcon />
                        </div>
                        <div className="why-card__content">
                            <h3>گوشیت دیگه جا نداره؟</h3>
                            <p>می‌تونی از نسخه تحت وب استفاده کنی. نیازی به نصب نداری، مستقیم از مرورگر وارد شو.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default WhySection;