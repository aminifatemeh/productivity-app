// api/apiService.js
import axios from 'axios';

const API_BASE = 'http://5.202.57.77:8000';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem('refreshToken');
            if (refresh) {
                try {
                    const response = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
                    localStorage.setItem('accessToken', response.data.access);
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('userId');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (username, password) => {
        const response = await axios.post(`${API_BASE}/login/`, { username, password });
        return response.data;
    },
    register: async (username, phoneNumber, password) => {
        const response = await axios.post(`${API_BASE}/register/`, {
            username,
            phone_number: phoneNumber,
            password,
        });
        return response.data;
    },
};

export const tasksAPI = {
    getAllTasks: async () => {
        const response = await apiClient.get('/tasks/all_tasks/');
        return response.data;
    },
    addTask: async (taskData) => {
        const response = await apiClient.post('/tasks/add_task/', taskData);
        return response.data;
    },
    updateTask: async (taskId, taskData) => {
        const response = await apiClient.put(`/tasks/${taskId}/edit_task/`, taskData);
        return response.data;
    },
    deleteTask: async (taskId) => {
        await apiClient.delete(`/tasks/${taskId}/delete_task/`);
    },
    toggleTask: async (taskId) => {
        const response = await apiClient.post(`/tasks/${taskId}/toggle/`);
        return response.data;
    },
};

export default apiClient;