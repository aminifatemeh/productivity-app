import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'http://171.22.24.204:8000';

function TaskComponentApi({ category, onTasksFetched, useApi }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFetching = useRef(false);

    const refreshToken = async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
            console.log('No refresh token available');
            return false;
        }
        try {
            const response = await axios.post(`${API_BASE}/api/token/refresh/`, { refresh });
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
            setLoading(false);
            setError(null);
            onTasksFetched([], false);
            return;
        }

        if (isFetching.current) {
            console.log('Fetch in progress, skipping...');
            return;
        }

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
                endpoint = `${API_BASE}/tasks/khak_khorde/`;
                break;
            case 'rumiz':
                endpoint = `${API_BASE}/tasks/rumiz/`;
                break;
            case 'nobatesh_mishe':
                endpoint = `${API_BASE}/tasks/nobatesh_mishe/`;
                break;
            default:
                endpoint = `${API_BASE}/tasks/all_tasks/`;
        }

        try {
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedTasks = Array.isArray(response.data) ? response.data.map((task, index) => ({
                id: task.id.toString(),
                title: task.title || 'Untitled',
                description: task.description || '',
                flag_tuNobat: task.flag_tuNobat || false,
                isDone: task.isDone || false,
                subtasks: task.subtasks || [],
                tags: task.tags || [],
                deadline_date: task.deadline_date || '',
                hour: task.hour || '',
                selectedDays: task.selectedDays || [],
                originalIndex: index,
            })) : [];
            setLoading(false);
            onTasksFetched(fetchedTasks, false);
        } catch (err) {
            console.error(`Error fetching tasks for ${category}:`, err.response?.data || err.message);
            if (err.response?.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    fetchTasks();
                } else {
                    setError('لطفاً دوباره وارد سیستم شوید');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userId');
                    setLoading(false);
                    onTasksFetched([], true);
                }
            } else if (err.response?.status === 500) {
                setError(`خطای سرور برای دسته "${category}" رخ داد. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.`);
                setLoading(false);
                onTasksFetched([], true);
            } else {
                setError(err.response?.data?.detail || 'خطایی در دریافت تسک‌ها رخ داد');
                setLoading(false);
                onTasksFetched([], true);
            }
        } finally {
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [category, useApi]);

    return { loading, error };
}

export default TaskComponentApi;