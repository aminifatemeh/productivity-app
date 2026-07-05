import React from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.scss";

function SettingsPage() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username") || "—";
    const userId   = localStorage.getItem("userId")   || "—";

    return (
        <div className="sp-page" dir="rtl">
            <div className="sp-bg" aria-hidden="true">
                <div className="sp-blob sp-blob--1" />
                <div className="sp-blob sp-blob--2" />
            </div>

            <div className="sp-shell">

                <div className="sp-header">
                    <div className="sp-header__title">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        تنظیمات
                    </div>
                </div>

                <div className="sp-card">
                    <div className="sp-card__label">
                        <div className="sp-card__label-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        اطلاعات کاربری
                    </div>

                    <div className="sp-readonly-grid">
                        <div className="sp-readonly-item">
                            <span className="sp-readonly-item__key">نام کاربری</span>
                            <span className="sp-readonly-item__val">{username}</span>
                        </div>
                        {/*<div className="sp-readonly-item">*/}
                        {/*    <span className="sp-readonly-item__key">شناسه کاربر</span>*/}
                        {/*    <span className="sp-readonly-item__val sp-readonly-item__val--mono">#{userId}</span>*/}
                        {/*</div>*/}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default SettingsPage;