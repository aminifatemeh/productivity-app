import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SidebarMenu from "../components/SidebarMenu";
import { LanguageContext } from "../context/LanguageContext";
import "./SettingsPage.scss";

function SettingsPage() {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useContext(LanguageContext);
    const [userInfo, setUserInfo] = useState({
        username: localStorage.getItem("username") || "",
        email: "",
        password: "",
    });
    const [appSettings, setAppSettings] = useState({
        language: localStorage.getItem("language") || "fa",
        theme: "light",
        timerDuration: localStorage.getItem("timerDuration") || "5",
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        timerDuration: "",
    });

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleAppSettingsChange = (e) => {
        const { name, value } = e.target;
        setAppSettings((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const newErrors = { username: "", email: "", password: "", timerDuration: "" };

        if (
            appSettings.timerDuration &&
            (isNaN(appSettings.timerDuration) || appSettings.timerDuration < 5 || appSettings.timerDuration > 120)
        ) {
            newErrors.timerDuration = t("settings.timerError");
        }

        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
        } else {
            if (userInfo.username) localStorage.setItem("username", userInfo.username);
            if (appSettings.timerDuration) localStorage.setItem("timerDuration", appSettings.timerDuration);
            localStorage.setItem("language", appSettings.language);
            setLanguage(appSettings.language); // اعمال زبان پس از ذخیره

            Swal.fire({
                title: t("settings.successTitle"),
                text: t("settings.successMessage"),
                icon: "success",
                confirmButtonText: t("settings.confirmButton"),
                timer: 2000,
                timerProgressBar: true,
            }).then(() => {
                navigate("/", { state: { timerDuration: appSettings.timerDuration } });
            });
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="settings-page d-flex">
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="settings-container">
                    <span className="settings-title">{t("settings.title")}</span>
                    <div className="settings-section">
                        <h3 className="section-title">{t("settings.userInfo")}</h3>
                        <div className="form-group">
                            <label>{t("settings.username")}</label>
                            <input
                                type="text"
                                name="username"
                                value={userInfo.username}
                                onChange={handleUserInfoChange}
                                className="form-control"
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
                        </div>
                        <div className="form-group">
                            <label>{t("settings.email")}</label>
                            <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleUserInfoChange}
                                className="form-control"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                            <label>{t("settings.password")}</label>
                            <input
                                type="password"
                                name="password"
                                value={userInfo.password}
                                onChange={handleUserInfoChange}
                                className="form-control"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                    </div>
                    <div className="settings-section">
                        <h3 className="section-title">{t("settings.appSettings")}</h3>
                        <div className="form-group">
                            <label>{t("settings.language")}</label>
                            <select
                                name="language"
                                value={appSettings.language}
                                onChange={handleAppSettingsChange}
                                className="form-control"
                            >
                                <option value="fa">{t("settings.language.fa")}</option>
                                <option value="en">{t("settings.language.en")}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t("settings.theme")}</label>
                            <select
                                name="theme"
                                value={appSettings.theme}
                                onChange={handleAppSettingsChange}
                                className="form-control"
                            >
                                <option value="light">{t("settings.theme.light")}</option>
                                <option value="dark">{t("settings.theme.dark")}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t("settings.timerDuration")}</label>
                            <input
                                type="number"
                                name="timerDuration"
                                value={appSettings.timerDuration}
                                onChange={handleAppSettingsChange}
                                className="form-control"
                                min="5"
                                max="120"
                            />
                            {errors.timerDuration && <span className="error-message">{errors.timerDuration}</span>}
                        </div>
                    </div>
                    <div className="settings-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            {t("settings.cancel")}
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            {t("settings.save")}
                        </button>
                    </div>
                </div>
            </div>
            <SidebarMenu />
        </div>
    );
}

export default SettingsPage;