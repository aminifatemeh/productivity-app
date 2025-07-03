import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const login = async (username, password) => {
    const response = await api.post('token/', {username, password})
    localStorage.setItem('access_token', response.data.token)
    localStorage.setItem('refresh_token', response.data.refresh)
    return response.data
}

export const getTasks = async () => {
    const response = await api.post('tasks')
    return response.data;
};

export default api