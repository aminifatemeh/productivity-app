import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function TaskComponentApi({ category, onTasksFetched, useApi, defaultTasks }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFetching = useRef(false); // برای جلوگیری از درخواست‌های مکرر

    const refreshToken = async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) return false;

        try {
            const response = await axios.post('http://82.115.17.58:8000/api/token/refresh/', {
                refresh,
            });
            localStorage.setItem('accessToken', response.data.access);
            console.log('Token refreshed successfully');
            return true;
        } catch (err) {
            console.error('Token refresh failed:', err.response?.data || err.message);
            return false;
        }
    };

    const fetchTasks = async () => {
        if (!useApi) {
            // اگر از API استفاده نمی‌کنیم، داده‌های پیش‌فرض را برگردان
            setLoading(false);
            setError(null);
            onTasksFetched(defaultTasks || [], false);
            return;
        }

        if (isFetching.current) return; // جلوگیری از درخواست‌های همزمان
        isFetching.current = true;
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('لطفاً ابتدا وارد سیستم شوید');
            setLoading(false);
            onTasksFetched([], true);
            isFetching.current = false;
            return;
        }

        let endpoint;
        switch (category) {
            case 'khak_khorde':
                endpoint = 'http://82.115.17.58:8000/api/tasks/khak_khorde/';
                break;
            case 'rumiz':
                endpoint = 'http://82.115.17.58:8000/api/tasks/rumiz/';
                break;
            case 'nobatesh_mishe':
                endpoint = 'http://82.115.17.58:8000/api/tasks/nobatesh_mishe/';
                break;
            default:
                endpoint = 'http://82.115.17.58:8000/api/tasks/khak_khorde/';
        }

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(`Response for ${category}:`, response.data);
            const fetchedTasks = Array.isArray(response.data) ? response.data : [];
            setLoading(false);
            onTasksFetched(fetchedTasks, false);
        } catch (err) {
            console.error(`Error fetching tasks for ${category}:`, err.response?.data || err.message);
            if (err.response?.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    fetchTasks(); // تلاش مجدد با توکن جدید
                } else {
                    setError('لطفاً دوباره وارد سیستم شوید');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    setLoading(false);
                    onTasksFetched([], true);
                }
            } else if (err.response?.status === 500) {
                setError(`خطای سرور برای دسته "${category}" رخ داد. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.`);
                setLoading(false);
                onTasksFetched([], true);
            } else {
                setError(err.message || 'خطایی در دریافت تسک‌ها رخ داد');
                setLoading(false);
                onTasksFetched([], true);
            }
        } finally {
            isFetching.current = false; // آزاد کردن قفل
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [category, useApi]); // اضافه کردن useApi به وابستگی‌ها

    if (!useApi) return null; // اگر از API استفاده نمی‌کنیم، چیزی رندر نشود
    if (loading) return <div>در حال بارگذاری...</div>;
    if (error) return (
        <div>
            خطا: {error}
            <button onClick={() => { setError(null); setLoading(true); fetchTasks(); }}>
                تلاش دوباره
            </button>
        </div>
    );

    return null;
}

export default TaskComponentApi;