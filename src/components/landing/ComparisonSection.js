import React from "react";
import './ComparisonSection.scss';

const WITHOUT_ITEMS = [
    "کارها گم میشن و فراموش میشن",
    "نمی‌دونی امروز باید چیکار کنی",
    "وقتت هدر میره بدون اینکه بفهمی",
    "استرس از کارهای عقب افتاده",
    "نمی‌دونی چقدر پیشرفت کردی",
    "هر روز از صفر شروع می‌کنی",
];

const WITH_ITEMS = [
    "همه کارها سازمان‌دهی شدن",
    "هر روز می‌دونی دقیقاً چیکار کنی",
    "زمانت رو ردیابی می‌کنی",
    "کارهای عقب افتاده مدیریت میشن",
    "پیشرفتت رو با نمودار می‌بینی",
    "عادت‌های خوب می‌سازی",
];

function ComparisonSection() {
    return (
        <section className="section section--comparison" id="comparison">
            <div className="section-container">
                <h2 className="section-title">با یار پلنر یا بدون یار پلنر؟</h2>

                <div className="comparison-grid">
                    <div className="comparison-card comparison-card--without">
                        <div className="comparison-card__header">
                            <span className="comparison-card__icon">😵</span>
                            <h3>بدون یار پلنر</h3>
                        </div>
                        <ul className="comparison-list comparison-list--bad">
                            {WITHOUT_ITEMS.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="comparison-card comparison-card--with">
                        <div className="comparison-card__header">
                            <span className="comparison-card__icon">🚀</span>
                            <h3>با یار پلنر</h3>
                        </div>
                        <ul className="comparison-list comparison-list--good">
                            {WITH_ITEMS.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ComparisonSection;