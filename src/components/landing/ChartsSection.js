import React from "react";
import MiniCharts from "./MiniCharts";
import './ChartsSection.scss';

const ChartBarIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.5"/>
        <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor"/>
    </svg>
);

function ChartsSection() {
    return (
        <section className="section section--charts" id="charts">
            <div className="section-container section-container--split section-container--reverse">
                <div className="split-visual">
                    <MiniCharts />
                </div>
                <div className="split-text">
                    <div className="section-tag">
                        <ChartBarIcon />
                        نمودارها
                    </div>
                    <h2 className="section-title section-title--left">
                        عملکردت رو ارزیابی کن
                    </h2>
                    <p className="section-desc">
                        با تحلیل داده‌های خودت، الگوهای رفتاریت رو کشف کن و اون‌ها رو تقویت کن.
                    </p>
                    <ul className="feature-list">
                        <li>تحلیل تمرکز روزانه، هفتگی و ماهانه</li>
                        <li>نمودار پیشرفت هفتگی و ماهانه</li>
                        <li>شناسایی الگوهای کارآمد</li>
                        <li>میزان اهمال‌کاری رو ببین و کاهش بده</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default ChartsSection;