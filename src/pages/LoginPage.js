import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.scss';

const API_BASE = 'http://5.202.57.77:8000';


function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/login/`, {
                username,
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
            console.log('Login successful:', { access, refresh, user_id });
            navigate('/');
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            // Fallback to offline login (optional, remove if not needed)
            if (username === 'admin' && password === '123') {
                localStorage.setItem('accessToken', 'offline_access_token');
                localStorage.setItem('refreshToken', 'offline_refresh_token');
                localStorage.setItem('username', username);
                localStorage.setItem('userId', 'offline_user');
                console.log('Offline login used for admin');
                navigate('/');
            } else {
                setError(err.response?.data?.detail || 'نام کاربری یا رمز عبور اشتباه است');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">ورود به سیستم</h2>
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
                            {isLoading ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </div>
                    <div className="form-group register-link">
                        <span>حساب ندارید؟ </span>
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => navigate('/register')}
                            disabled={isLoading}
                        >
                            ثبت‌نام کنید
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;