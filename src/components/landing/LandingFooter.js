import React from "react";
import LogoPlaceholder from "./LogoPlaceholder";
import './LandingFooter.scss';

function LandingFooter() {
    return (
        <footer className="landing-footer">
            <div className="section-container">
                <div className="footer-inner">
                    <LogoPlaceholder />
                    <p className="footer-copy">
                        ساخته شده با ❤️ برای کاربران ایرانی
                    </p>
                    <div className="footer-links">
                        <a href="#">درباره ما</a>
                        <a href="#">تماس</a>
                        <a href="#">حریم خصوصی</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;