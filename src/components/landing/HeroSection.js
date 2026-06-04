import React from "react";
import { useNavigate } from "react-router-dom";
import LogoPlaceholder from "./LogoPlaceholder";
import HeroVisual from "./HeroVisual";
import './HeroSection.scss'

function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="section section--hero" id="hero">
            <nav className="hero-nav">
                <LogoPlaceholder />
                <div className="hero-nav__actions">
                    <button className="btn btn--ghost" onClick={() => navigate("/login")}>
                        ورود
                    </button>
                    <button className="btn btn--primary" onClick={() => navigate("/register")}>
                        ثبت‌نام
                    </button>
                </div>
            </nav>

            <div className="hero-body">
                <div className="hero-text">
                    <div className="hero-badge">
                        <span className="badge-dot" />
                        مدیریت زمان هوشمند
                    </div>

                    <h1 className="hero-title">
                        برای رویاهات
                        <span className="hero-title__accent"> برنامه‌ریزی کن!</span>
                    </h1>

                    <p className="hero-tagline">
                        غول‌های بزرگ رو به کارهای کوچک شدنی تبدیل کن!
                    </p>

                    <p className="hero-sub">
                        بیا با هم پیش بریم!
                    </p>

                    <div className="hero-actions">
                        <button className="btn btn--primary btn--hero" onClick={() => navigate("/register")}>
                            شروع رایگان
                        </button>
                        <button className="btn btn--secondary btn--hero" onClick={() => navigate("/login")}>
                            قبلاً ثبت‌نام کردم
                        </button>
                    </div>
                </div>

                <div className="hero-visual">
                    <HeroVisual />
                </div>
            </div>
        </section>
    );
}

export default HeroSection;