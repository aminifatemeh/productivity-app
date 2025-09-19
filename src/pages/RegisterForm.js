import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.scss';

const API_BASE = 'http://171.22.24.204:8000';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic phone number validation (Iran format: 11 digits)
        if (!/^\d{11}$/.test(phoneNumber)) {
            setError('شماره تلفن باید ۱۱ رقم باشد');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE}/register/`, {
                username,
                phone_number: phoneNumber,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { access, refresh, user_id } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('userId', user_id);
            localStorage.setItem('username', username);
            console.log('Registration successful:', { access, refresh, user_id });
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err.response?.data || err.message);
            setError(err.response?.data?.detail || 'خطایی در ثبت‌نام رخ داد');
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">ثبت‌نام در سیستم</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            نام کاربری
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="نام کاربری خود را وارد کنید"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">
                            شماره تلفن
                        </label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="form-input"
                            placeholder="09123456789"
                            maxLength={11}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            رمز عبور
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="رمز عبور خود را وارد کنید"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                        </button>
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="submit-button secondary"
                            onClick={() => navigate('/login')}
                            disabled={isLoading}
                        >
                            بازگشت به ورود
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;