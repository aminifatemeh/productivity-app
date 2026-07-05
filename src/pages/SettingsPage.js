import React from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.scss";
import { SettingsPageTitleIcon, UserInfoIcon } from "../components/Icons"; // Adjust path if needed


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
                        <SettingsPageTitleIcon />
                        تنظیمات
                    </div>
                </div>

                <div className="sp-card">
                    <div className="sp-card__label">
                        <div className="sp-card__label-icon">
                            <UserInfoIcon />

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