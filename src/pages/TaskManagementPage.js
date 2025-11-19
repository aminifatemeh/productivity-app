// pages/TaskManagementPage.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TaskManagementPage.scss';
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import TaskComponentApi from "../api/TaskComponentApi";
import AddTaskModal from "../components/AddTaskModal";
import { TaskContext } from "../components/TaskContext";
import moment from 'jalali-moment';

function TaskManagementPage() {
    const { tasks, setTasks, editTask, deleteTask, toggleTask } = useContext(TaskContext);
    const [selectedCategory, setSelectedCategory] = useState('khak_khorde');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tabsWrapperRef = useRef(null);
    const tabRefs = useRef({});

    // گرفتن تسک‌ها از سرور (در صورت موجود بودن)
    const { loading, error } = TaskComponentApi({
        onTasksFetched: (fetchedTasks, hasError) => {
            if (!hasError && fetchedTasks?.length > 0) {
                setTasks(prev => {
                    const existingIds = new Set(prev.map(t => t.id));
                    const newOnes = fetchedTasks
                        .filter(t => t.id && !existingIds.has(String(t.id)))
                        .map((t, i) => ({
                            ...t,
                            id: String(t.id),
                            originalIndex: prev.length + i,
                        }));
                    return [...prev, ...newOnes];
                });
            }
        },
        useApi: true,
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get('date');
        setSelectedDate(date || null);
    }, [location.search]);

    useEffect(() => {
        if (location.state?.openEditModalFor) {
            const taskId = location.state.openEditModalFor;
            const taskToEdit = tasks.find(t => t.id === taskId);
            if (taskToEdit) {
                setEditingTask(taskToEdit);
                setIsAddTaskModalOpen(true);
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.state, tasks, navigate, location]);

    useEffect(() => {
        const activeTab = tabRefs.current[selectedCategory];
        if (activeTab && tabsWrapperRef.current) {
            tabsWrapperRef.current.style.setProperty('--slider-left', `${activeTab.offsetLeft}px`);
            tabsWrapperRef.current.style.setProperty('--slider-width', `${activeTab.offsetWidth}px`);
        }
    }, [selectedCategory]);

    const clearDateFilter = () => {
        setSelectedDate(null);
        navigate('/task-management');
    };

    const handleAddTask = (newTask) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // آنلاین — ارسال به سرور
        } else {
            // آفلاین
            const userId = localStorage.getItem('userId') || 'offline_user';
            const newId = Date.now().toString(36) + '_' + Math.random().toString(36).substr(2);
            const taskToSave = { ...newTask, id: newId, isDone: false, originalIndex: tasks.length };
            const updated = [...tasks, taskToSave];
            localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated));
            setTasks(updated);
        }
        setIsAddTaskModalOpen(false);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsAddTaskModalOpen(true);
    };

    const handleTaskUpdated = (updatedTask) => {
        editTask(updatedTask);
        setIsAddTaskModalOpen(false);
        setEditingTask(null);
    };

    const categories = [
        { id: 'khak_khorde', label: 'خاک خورده', icon: "/assets/icons/khak_khorde_icon.svg" },
        { id: 'rumiz', label: 'رومیز', icon: "/assets/icons/rumiz_icon.svg" },
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', icon: "/assets/icons/nobatesh_mishe_icon.svg" },
    ];

    const filteredTasks = tasks.filter(task => {
        if (!task?.id) return false;
        const today = moment().startOf('day');
        const taskDate = task.deadline_date ? moment(task.deadline_date, 'YYYY-MM-DD') : null;

        if (selectedDate) return taskDate?.format('YYYY-MM-DD') === selectedDate;
        if (selectedCategory === 'nobatesh_mishe') return (task.flag_tuNobat || (taskDate && taskDate.isSameOrAfter(today))) && !task.isDone;
        if (selectedCategory === 'khak_khorde') return !task.flag_tuNobat && taskDate && taskDate.isBefore(today) && !task.isDone;
        if (selectedCategory === 'rumiz') return task.isDone;
        return true;
    });

    const formatDate = (date) => {
        if (!date) return '';
        const m = moment(date, 'YYYY-MM-DD', true); // parse strict
        if (!m.isValid()) return '';
        return m.locale('fa').format('jYYYY/jMM/jDD');
    };


    return (
        <div className="d-flex task-management-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="header-placeholder"></div>

                <div className="tab-container">
                    <div className="tabs-wrapper" ref={tabsWrapperRef}>
                        {categories.map((cat, i) => (
                            <React.Fragment key={cat.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`tab-button ${selectedCategory === cat.id ? 'active' : ''}`}
                                    ref={el => tabRefs.current[cat.id] = el}
                                >
                                    <img src={cat.icon} alt={cat.label} className="tab-icon" />
                                    {cat.label}
                                </button>
                                {i < categories.length - 1 && <div className="tab-separator"></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    {selectedDate && (
                        <div className="date-filter-info">
                            <span>فیلتر تاریخ: {formatDate(selectedDate)}</span>
                            <button className="clear-date-filter-btn" onClick={clearDateFilter}>
                                حذف فیلتر تاریخ
                            </button>
                        </div>
                    )}
                </div>

                {/* پیام خطای سرور */}
                {error && (
                    <div className="text-center py-2 text-warning">
                        اتصال به سرور قطع است — در حالت آفلاین
                    </div>
                )}

                <div className="flex-grow-1 d-flex flex-column tasks-grid">
                    {loading ? (
                        <div className="text-center py-5">در حال بارگذاری از سرور...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-message text-center py-5">هیچ تسکی یافت نشد</div>
                    ) : (
                        <div className="row gy-4">
                            {filteredTasks.map(task => (
                                <div className="col-12 col-sm-6 col-md-4" key={task.id}>
                                    <TaskCard
                                        task={{ ...task, deadline_date: formatDate(task.deadline_date) }}
                                        originalIndex={task.originalIndex}
                                        onEditTask={handleEditTask}
                                        onDeleteTask={deleteTask}
                                        onUpdateTask={editTask}
                                        onToggleTask={toggleTask}
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
