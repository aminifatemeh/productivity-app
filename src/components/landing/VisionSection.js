import React from "react";
import SectionPlaceholder from "./SectionPlaceholder";
import './VisionSection.scss';

const VisionIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
);

function VisionSection() {
    return (
        <section className="section section--vision" id="vision">
            <div className="section-container section-container--split">
                <div className="split-text">
                    <div className="section-tag">
                        <VisionIcon />
                        چشم‌انداز
                    </div>
                    <h2 className="section-title section-title--left">
                        یک ماه رو در یک نگاه ببین
                    </h2>
                    <p className="section-desc">
                        در بخش چشم‌انداز می‌تونی کل یک ماه رو یکجا ببینی. برنامه‌ریزی بلندمدت‌تر، تصمیم‌گیری بهتر.
                    </p>
                    <ul className="feature-list">
                        <li>نمای ماهانه با تقویم شمسی</li>
                        <li>توزیع کارها در طول ماه</li>
                        <li>شناسایی روزهای شلوغ و خلوت</li>
                    </ul>
                </div>
                <div className="split-visual">
                    <SectionPlaceholder
                        name="VISION_VISUAL"
                        hint="المان از VisionPage اینجا قرار می‌گیره"
                    />
                </div>
            </div>
        </section>
    );
}

export default VisionSection;