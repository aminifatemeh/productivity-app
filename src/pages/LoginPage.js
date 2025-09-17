import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';

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
            const response = await fetch('http://82.115.17.58:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('نام کاربری یا رمز عبور اشتباه است');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('username', username);
            navigate('/');
        } catch (err) {
            // Check if error is due to network/API unavailability
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                // Fallback to offline login
                if (username === 'admin' && password === '123') {
                    localStorage.setItem('accessToken', 'offline_access_token');
                    localStorage.setItem('refreshToken', 'offline_refresh_token');
                    localStorage.setItem('username', username);
                    navigate('/');
                } else {
                    setError('نام کاربری یا رمز عبور اشتباه است');
                }
            } else {
                setError(err.message || 'خطایی در ورود رخ داد');
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
                    />
                </div>
                <div className="form-group">
                    <button
                        onClick={handleSubmit}
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'در حال ورود...' : 'ورود'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;