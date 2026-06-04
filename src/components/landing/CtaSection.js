import React from "react";
import { useNavigate } from "react-router-dom";
import './CtaSection.scss';

const TelegramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.15.67-.54.835-1.094.52l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.215-3.053 5.56-5.023c.242-.215-.053-.334-.373-.12L7.48 14.49l-2.95-.92c-.64-.2-.653-.64.134-.948l11.52-4.44c.533-.194 1.002.13.378.066z"/>
    </svg>
);

const AndroidIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.523 15.341a.5.5 0 01-.5.5H6.977a.5.5 0 01-.5-.5V9.5h11.046v5.841zM7.5 18.5a1 1 0 102 0 1 1 0 00-2 0zm7 0a1 1 0 102 0 1 1 0 00-2 0zM15.6 3.3l1.4-2.4a.3.3 0 00-.52-.3l-1.42 2.46A8.01 8.01 0 0012 2.5a8.01 8.01 0 00-3.06.56L7.52.6a.3.3 0 00-.52.3L8.4 3.3A7.5 7.5 0 004.5 9h15a7.5 7.5 0 00-3.9-5.7zM9.5 7a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z"/>
    </svg>
);

function CtaSection() {
    const navigate = useNavigate();

    return (
        <section className="section section--cta" id="cta">
            <div className="section-container">
                <div className="cta-box">
                    <div className="cta-blob" aria-hidden="true" />
                    <h2 className="cta-title">همین الان شروع کن!</h2>
                    <p className="cta-desc">
                        رایگانه. نیازی به کارت بانکی نداری. همین الان ثبت‌نام کن.
                    </p>
                    <div className="cta-actions">
                        <button
                            className="btn btn--primary btn--xl"
                            onClick={() => navigate("/register")}
                        >
                            ثبت‌نام رایگان
                        </button>
                        <button
                            className="btn btn--ghost btn--xl"
                            onClick={() => navigate("/login")}
                        >
                            قبلاً ثبت‌نام کردم
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CtaSection;