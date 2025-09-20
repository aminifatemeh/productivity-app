import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TaskManagementPage.scss';
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import TaskComponentApi from "../api/TaskComponentApi";
import AddTaskModal from "../components/AddTaskModal";
import { TaskContext } from "../components/TaskContext";
import moment from 'jalali-moment';
import axios from 'axios';

const API_BASE = 'http://171.22.24.204:8000';

function TaskManagementPage({ useApi }) {
    const { tasks, setTasks, editTask, deleteTask } = useContext(TaskContext);
    const isJalali = true;
    const [selectedCategory, setSelectedCategory] = useState('khak_khorde');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tabsWrapperRef = useRef(null);
    const tabRefs = useRef({});

    const { loading, error } = TaskComponentApi({
        onTasksFetched: (fetchedTasks, hasError) => {
            if (!hasError) {
                setTasks((prevTasks) => {
                    const existingTaskIds = new Set(prevTasks.map((task) => task.id));
                    const newTasks = fetchedTasks.filter((task) => !existingTaskIds.has(task.id));
                    return [...prevTasks, ...newTasks];
                });
            }
        },
        useApi,
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get('date');
        setSelectedDate(date || null);
    }, [location.search]);

    useEffect(() => {
        const activeTab = tabRefs.current[selectedCategory];
        if (activeTab && tabsWrapperRef.current) {
            const { offsetLeft, offsetWidth } = activeTab;
            const tabsWrapper = tabsWrapperRef.current;
            tabsWrapper.style.setProperty('--slider-left', `${offsetLeft}px`);
            tabsWrapper.style.setProperty('--slider-width', `${offsetWidth}px`);
        }
    }, [selectedCategory]);

    const clearDateFilter = () => {
        setSelectedDate(null);
        navigate('/task-management');
    };

    const handleAddTask = async (newTask) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No access token found');
            navigate('/login');
            return;
        }

        console.log('New Task being sent:', newTask);

        try {
            const response = await axios.post(
                `${API_BASE}/tasks/add_task/`,
                {
                    title: newTask.title,
                    description: newTask.description,
                    deadline_date: newTask.deadline_date,
                    flag_tuNobat: newTask.flag_tuNobat,
                    hour: newTask.hour,
                    selectedDays: newTask.selectedDays,
                    subtasks: newTask.subtasks,
                    tags: newTask.tags,
                    isDone: newTask.isDone,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('API Response:', response.data);

            const addedTask = {
                id: response.data.id.toString(),
                title: response.data.title || 'بدون عنوان',
                description: response.data.description || '',
                flag_tuNobat: response.data.flag_tuNobat || false,
                isDone: response.data.isDone || false,
                subtasks: response.data.subtasks || [],
                tags: response.data.tags || [],
                deadline_date: response.data.deadline_date || '',
                hour: response.data.hour || '',
                selectedDays: response.data.selectedDays || [],
                originalIndex: tasks.length,
            };

            setTasks((prevTasks) => [...prevTasks, addedTask]);
            setIsAddTaskModalOpen(false);
        } catch (err) {
            console.error('Error adding task:', err.response?.data || err.message);
            if (err.response?.status === 401) {
                const refresh = localStorage.getItem('refreshToken');
                if (refresh) {
                    try {
                        const refreshResponse = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
                        localStorage.setItem('accessToken', refreshResponse.data.access);
                        handleAddTask(newTask);
                    } catch (refreshErr) {
                        console.error('Token refresh failed:', refreshErr.response?.data || refreshErr.message);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        navigate('/login');
                    }
                } else {
                    navigate('/login');
                }
            }
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsAddTaskModalOpen(true);
    };

    const handleTaskUpdated = async (updatedTask) => {
        const result = await editTask(updatedTask);
        if (result.success) {
            setIsAddTaskModalOpen(false);
            setEditingTask(null);
        } else {
            console.error('Error updating task:', result.error);
            if (result.error.includes('دوباره وارد سیستم شوید')) {
                navigate('/login');
            }
        }
    };

    const categories = [
        { id: 'khak_khorde', label: 'خاک خورده', icon: "/assets/icons/khak_khorde_icon.svg" },
        { id: 'rumiz', label: 'رومیز', icon: "/assets/icons/rumiz_icon.svg" },
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', icon: "/assets/icons/nobatesh_mishe_icon.svg" },
    ];

    const filteredTasks = tasks.filter((task) => {
        if (!task || !task.id) return false;

        const today = moment().startOf('day');
        const taskDate = task.deadline_date ? moment(task.deadline_date, 'YYYY-MM-DD') : null;

        if (selectedDate) {
            const formattedTaskDate = taskDate ? taskDate.format('YYYY-MM-DD') : '';
            console.log(`Task ID: ${task.id}, Task Date: ${formattedTaskDate}, Selected Date: ${selectedDate}`);
            return formattedTaskDate === selectedDate;
        }

        if (selectedCategory === 'nobatesh_mishe') {
            return (task.flag_tuNobat || (taskDate && taskDate.isSameOrAfter(today))) && !task.isDone;
        }
        if (selectedCategory === 'khak_khorde') {
            return !task.flag_tuNobat && taskDate && taskDate.isBefore(today) && !task.isDone;
        }
        if (selectedCategory === 'rumiz') {
            return task.isDone;
        }
        return true;
    });

    const formatDate = (date) => {
        if (!date) return '';
        return moment(date, 'YYYY-MM-DD').locale('fa').format('jYYYY/jMM/jDD');
    };

    return (
        <div className="d-flex task-management-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="header-placeholder"></div>
                <div className="tab-container">
                    <div className="tabs-wrapper" ref={tabsWrapperRef}>
                        {categories.map((category, index) => (
                            <React.Fragment key={category.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`tab-button ${selectedCategory === category.id ? 'active' : ''}`}
                                    ref={(el) => (tabRefs.current[category.id] = el)}
                                    aria-label={`${category.label} tab`}
                                >
                                    <img
                                        src={category.icon}
                                        alt={`${category.label} icon`}
                                        className="tab-icon"
                                    />
                                    {category.label}
                                </button>
                                {index < categories.length - 1 && (
                                    <div className="tab-separator"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    {selectedDate && (
                        <div className="date-filter-info">
                            <span>فیلتر تاریخ: {formatDate(selectedDate)}</span>
                            <button
                                type="button"
                                className="clear-date-filter-btn"
                                onClick={clearDateFilter}
                            >
                                حذف فیلتر تاریخ
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex-grow-1 d-flex flex-column tasks-grid">
                    {loading ? (
                        <div>در حال بارگذاری...</div>
                    ) : error ? (
                        <div>
                            خطا: {error}
                            <button onClick={() => window.location.reload()}>تلاش دوباره</button>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-message">
                            هیچ تسکی یافت نشد
                        </div>
                    ) : (
                        <div className="row gy-4">
                            {filteredTasks.map((task) => (
                                <div className="col-12 col-sm-6 col-md-4" key={task.id}>
                                    <TaskCard
                                        task={{
                                            ...task,
                                            deadline_date: formatDate(task.deadline_date),
                                            tags: task.tags?.map((tag) => ({
                                                ...tag,
                                                name: tag.isDefault ? tag.name : tag.name,
                                            })) || [],
                                        }}
                                        originalIndex={task.originalIndex}
                                        onEditTask={handleEditTask}
                                        onDeleteTask={deleteTask}
                                        onUpdateTask={(updatedTask) => editTask(updatedTask)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="footer-section d-flex w-100 justify-content-center align-items-center">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingTask(null);
                            setIsAddTaskModalOpen(true);
                        }}
                        className="add-task-button"
                        aria-label="اضافه کردن تسک"
                    >
                        اضافه کردن تسک
                    </button>
                </div>
            </div>
            {isAddTaskModalOpen && (
                <div className="modal-overlay">
                    <AddTaskModal
                        isOpen={isAddTaskModalOpen}
                        onClose={() => {
                            setIsAddTaskModalOpen(false);
                            setEditingTask(null);
                        }}
                        onTaskAdded={editingTask ? handleTaskUpdated : handleAddTask}
                        initialTask={editingTask}
                        selectedDate={selectedDate}
                    />
                </div>
            )}
        </div>
    );
}

export default TaskManagementPage;