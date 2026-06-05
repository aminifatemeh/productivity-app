// RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';
import './RegisterPage.scss';

// ─── Validation helpers ───────────────────────────────────────────────────────

const validateUsername = (value) => {
    if (!value.trim()) return 'نام کاربری الزامی است';
    if (value.length > 150) return 'نام کاربری نباید بیشتر از ۱۵۰ کاراکتر باشد';
    if (!/^[a-zA-Z0-9@.+\-_]+$/.test(value))
        return 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و علائم @ . + - _ باشد';
    return '';
};

const validatePhone = (value) => {
    if (!value) return 'شماره تلفن الزامی است';
    if (!/^09\d{9}$/.test(value))
        return 'شماره تلفن باید با ۰۹ شروع شده و دقیقاً ۱۱ رقم باشد';
    return '';
};

const validatePassword = (value) => {
    if (!value) return 'رمز عبور الزامی است';
    if (value.length < 8) return 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    return '';
};

// ─── Password strength ────────────────────────────────────────────────────────

const getPasswordStrength = (value) => {
    if (!value) return null;

    let score = 0;
    const checks = {
        length:     value.length >= 8,
        longLength: value.length >= 12,
        upper:      /[A-Z]/.test(value),
        lower:      /[a-z]/.test(value),
        digit:      /\d/.test(value),
        special:    /[^a-zA-Z0-9]/.test(value),
    };

    if (checks.length)     score++;
    if (checks.longLength) score++;
    if (checks.upper)      score++;
    if (checks.lower)      score++;
    if (checks.digit)      score++;
    if (checks.special)    score++;

    // All-numeric penalty
    if (/^\d+$/.test(value)) score = Math.min(score, 1);

    if (score <= 1) return { level: 'weak',   label: 'ضعیف',    bars: 1, warning: '' };
    if (score <= 3) return { level: 'fair',   label: 'متوسط',   bars: 2, warning: '' };
    if (score <= 4) return { level: 'good',   label: 'خوب',     bars: 3, warning: '' };
    return              { level: 'strong', label: 'قوی',     bars: 4, warning: '' };
};

// ─── Backend error parser ─────────────────────────────────────────────────────

const DJANGO_TRANSLATIONS = {
    'A user with that username already exists.':                              'این نام کاربری قبلاً ثبت شده است',
    'This field must be unique.':                                             'این مقدار قبلاً ثبت شده است',
    'This field may not be blank.':                                           'این فیلد نمی‌تواند خالی باشد',
    'This field is required.':                                                'این فیلد الزامی است',
    'Enter a valid value.':                                                   'مقدار وارد شده معتبر نیست',
    'Ensure this field has no more than 150 characters.':                     'نام کاربری نباید بیشتر از ۱۵۰ کاراکتر باشد',
    'Ensure this field has no more than 15 characters.':                      'شماره تلفن نباید بیشتر از ۱۵ کاراکتر باشد',
    'This password is too short. It must contain at least 8 characters.':    'رمز عبور خیلی کوتاه است — حداقل ۸ کاراکتر لازم است',
    'This password is too common.':                                           'رمز عبور خیلی رایج است — رمز قوی‌تری انتخاب کنید',
    'This password is entirely numeric.':                                     'رمز عبور نمی‌تواند فقط عددی باشد',
};

const translateMsg = (msg) => DJANGO_TRANSLATIONS[msg] ?? msg;

const parseBackendErrors = (data) => {
    if (!data || typeof data !== 'object') return {};

    const fieldMap = {
        username:     'username',
        phone_number: 'phoneNumber',
        password:     'password',
        gender:       'gender',
    };

    const errors = {};
    for (const [backendKey, frontKey] of Object.entries(fieldMap)) {
        if (data[backendKey]) {
            const raw = Array.isArray(data[backendKey]) ? data[backendKey][0] : data[backendKey];
            errors[frontKey] = translateMsg(raw);
        }
    }

    if (data.non_field_errors) {
        errors.general = translateMsg(
            Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors
        );
    } else if (data.detail) {
        errors.general = translateMsg(data.detail);
    }

    return errors;
};

// ─── Password Strength Bar component ─────────────────────────────────────────

function PasswordStrengthBar({ value }) {
    const strength = getPasswordStrength(value);
    if (!strength) return null;

    return (
        <div className="password-strength" aria-live="polite">
            <div className="strength-bars">
                {[1, 2, 3, 4].map((bar) => (
                    <div
                        key={bar}
                        className={`strength-bar ${bar <= strength.bars ? `strength-bar--${strength.level}` : ''}`}
                    />
                ))}
            </div>
            <span className={`strength-label strength-label--${strength.level}`}>
                {strength.label}
            </span>
            {strength.warning && (
                <span className="field-warning">{strength.warning}</span>
            )}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

function RegisterPage() {
    const [fields, setFields] = useState({
        username:    '',
        phoneNumber: '',
        password:    '',
        gender:      '',
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isLoading, setIsLoading]       = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitized = name === 'phoneNumber' ? value.replace(/[^0-9]/g, '') : value;
        setFields((prev) => ({ ...prev, [name]: sanitized }));
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateAll = () => ({
        username:    validateUsername(fields.username),
        phoneNumber: validatePhone(fields.phoneNumber),
        password:    validatePassword(fields.password),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        const errors = validateAll();
        console.log('[Register] client validation errors:', errors);

        if (Object.values(errors).some(Boolean)) {
            setFieldErrors(errors);
            return;
        }

        const gender = fields.gender !== '' ? fields.gender === 'true' : undefined;
        console.log('[Register] sending payload:', {
            username: fields.username,
            phone_number: fields.phoneNumber,
            password: fields.password,
            gender,
        });

        setIsLoading(true);
        try {
            const response = await authAPI.register(
                fields.username,
                fields.phoneNumber,
                fields.password,
                gender
            );
            console.log('[Register] success response:', response);

            const { access, refresh, user_id } = response;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('userId', user_id);
            localStorage.setItem('username', fields.username);

            navigate('/dashboard');
        } catch (err) {
            console.error('[Register] error status:', err.response?.status);
            console.error('[Register] error data:', err.response?.data);
            console.error('[Register] error message:', err.message);

            const data = err.response?.data;
            if (data && typeof data === 'object') {
                const parsed = parseBackendErrors(data);
                console.log('[Register] parsed backend errors:', parsed);
                const { general, ...rest } = parsed;
                setFieldErrors(rest);
                if (general) setGeneralError(general);
            } else {
                setGeneralError('خطایی در ثبت‌نام رخ داد. لطفاً دوباره تلاش کنید');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">ثبت‌نام در سیستم</h2>

                {generalError && (
                    <div className="error-message" role="alert">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>

                    {/* Username */}
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">نام کاربری</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={fields.username}
                            onChange={handleChange}
                            className={`form-input${fieldErrors.username ? ' input-error' : ''}`}
                            placeholder="مثال: john_doe"
                            maxLength={150}
                            disabled={isLoading}
                            required
                            aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                        />
                        {fieldErrors.username && (
                            <span id="username-error" className="field-error" role="alert">
                                {fieldErrors.username}
                            </span>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">شماره تلفن</label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={fields.phoneNumber}
                            onChange={handleChange}
                            className={`form-input${fieldErrors.phoneNumber ? ' input-error' : ''}`}
                            placeholder="09123456789"
                            maxLength={11}
                            disabled={isLoading}
                            required
                            aria-describedby={fieldErrors.phoneNumber ? 'phone-error' : undefined}
                        />
                        {fieldErrors.phoneNumber && (
                            <span id="phone-error" className="field-error" role="alert">
                                {fieldErrors.phoneNumber}
                            </span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">رمز عبور</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={fields.password}
                            onChange={handleChange}
                            className={`form-input${fieldErrors.password ? ' input-error' : ''}`}
                            placeholder="حداقل ۸ کاراکتر"
                            disabled={isLoading}
                            required
                            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                        />
                        {fieldErrors.password && (
                            <span id="password-error" className="field-error" role="alert">
                                {fieldErrors.password}
                            </span>
                        )}
                        <PasswordStrengthBar value={fields.password} />
                    </div>

                    {/* Gender (optional) */}
                    <div className="form-group">
                        <label htmlFor="gender" className="form-label">
                            جنسیت <span className="optional-label">(اختیاری)</span>
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={fields.gender}
                            onChange={handleChange}
                            className="form-input"
                            disabled={isLoading}
                        >
                            <option value="">-</option>
                            <option value="false">مرد</option>
                            <option value="true">زن</option>
                        </select>
                        {fieldErrors.gender && (
                            <span className="field-error" role="alert">{fieldErrors.gender}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <button type="submit" className="submit-button" disabled={isLoading}>
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

export default RegisterPage;
