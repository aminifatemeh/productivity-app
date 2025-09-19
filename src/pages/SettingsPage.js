import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SidebarMenu from "../components/SidebarMenu";
import "./SettingsPage.scss";

function SettingsPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        username: localStorage.getItem("username") || "",
        email: "",
        password: "",
    });
    const [appSettings, setAppSettings] = useState({
        language: "fa",
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

        // اعتبارسنجی مدت زمان تایمر
        if (appSettings.timerDuration && (isNaN(appSettings.timerDuration) || appSettings.timerDuration < 5 || appSettings.timerDuration > 120)) {
            newErrors.timerDuration = "مدت زمان باید بین ۵ تا ۱۲۰ دقیقه باشد";
        }

        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
        } else {
            // ذخیره تنظیمات در localStorage
            if (userInfo.username) localStorage.setItem("username", userInfo.username);
            if (appSettings.timerDuration) localStorage.setItem("timerDuration", appSettings.timerDuration);

            // نمایش مدال با SweetAlert2
            Swal.fire({
                title: "موفقیت!",
                text: "تغییرات با موفقیت ذخیره شد!",
                icon: "success",
                confirmButtonText: "باشه",
                timer: 2000,
                timerProgressBar: true,
            }).then(() => {
                // انتقال به صفحه داشبورد با ارسال timerDuration به‌عنوان state
                navigate("/", { state: { timerDuration: appSettings.timerDuration } });
            });
        }
    };

    const handleCancel = () => {
        navigate("/"); // بازگشت به داشبورد
    };

    return (
        <div className="d-flex settings-page">
            <SidebarMenu />
            <div className="d-flex flex-column flex-grow-1">
                <div className="settings-container">
                    <span className="settings-title">تنظیمات</span>
                    <div className="settings-section">
                        <h3 className="section-title">اطلاعات کاربر</h3>
                        <div className="form-group">
                            <label>نام کاربری</label>
                            <input
                                type="text"
                                name="username"
                                value={userInfo.username}
                                onChange={handleUserInfoChange}
                                className="form-control"
                            />
                            {errors.username && (
                                <span className="error-message">{errors.username}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>ایمیل</label>
                            <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleUserInfoChange}
                                className="form-control"
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>رمز عبور جدید</label>
                            <input
                                type="password"
                                name="password"
                                value={userInfo.password}
                                onChange={handleUserInfoChange}
                                className="form-control"
                            />
                            {errors.password && (
                                <span className="error-message">{errors.password}</span>
                            )}
                        </div>
                    </div>
                    <div className="settings-section">
                        <h3 className="section-title">تنظیمات برنامه</h3>
                        <div className="form-group">
                            <label>زبان</label>
                            <select
                                name="language"
                                value={appSettings.language}
                                onChange={handleAppSettingsChange}
                                className="form-control"
                            >
                                <option value="fa">فارسی</option>
                                <option value="en">انگلیسی</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>تم</label>
                            <select
                                name="theme"
                                value={appSettings.theme}
                                onChange={handleAppSettingsChange}
                                className="form-control"
                            >
                                <option value="light">روشن</option>
                                <option value="dark">تیره</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>مدت زمان تایمر (دقیقه)</label>
                            <input
                                type="number"
                                name="timerDuration"
                                value={appSettings.timerDuration}
                                onChange={handleAppSettingsChange}
                                className="form-control"
                                min="5"
                                max="120"
                            />
                            {errors.timerDuration && (
                                <span className="error-message">{errors.timerDuration}</span>
                            )}
                        </div>
                    </div>
                    <div className="settings-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            لغو
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            ذخیره تغییرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;