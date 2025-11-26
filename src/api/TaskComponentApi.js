// api/TaskComponentApi.js
import { useEffect, useState, useRef } from 'react';
import { tasksAPI } from './apiService';

function TaskComponentApi({ onTasksFetched, useApi }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isFetching = useRef(false);

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

        try {
            const data = await tasksAPI.getAllTasks();

            // فیلتر کردن: فقط تسک‌های اصلی (بدون parent)
            const fetchedTasks = Array.isArray(data)
                ? data
                    .filter(task => !task.parent) // فیلتر ساب‌تسک‌ها
                    .map((task, index) => ({
                        id: task.id.toString(),
                        title: task.title || 'Untitled',
                        description: task.description || '',
                        flag_tuNobat: task.flag_tuNobat || false,
                        isDone: !!task.done_date, // استفاده از done_date
                        subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(sub => ({
                            id: sub.id,
                            title: sub.title || '',
                            isDone: !!sub.done_date,
                            done_date: sub.done_date || null,
                        })) : [],
                        tags: task.tags || [],
                        deadline_date: task.deadline_date || '',
                        hour: task.hour || '',
                        selectedDays: task.selectedDays || [],
                        originalIndex: index,
                    }))
                : [];

            setLoading(false);
            onTasksFetched(fetchedTasks, false);
        } catch (err) {
            console.error('Error fetching tasks:', err.response?.data || err.message);
            if (err.response?.status === 500) {
                setError('خطای سرور رخ داد. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.');
            } else {
                setError(err.response?.data?.detail || 'خطایی در دریافت تسک‌ها رخ داد');
            }
            setLoading(false);
            onTasksFetched([], true);
        } finally {
            isFetching.current = false;
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [useApi]);

    return { loading, error };
}

export default TaskComponentApi;