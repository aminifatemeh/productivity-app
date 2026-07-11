// pages/TaskManagementPage.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TaskManagementPage.scss';
import TaskCard from "../components/taskmanagement/TaskCard";
import AddTaskModal from "../components/taskmanagement/AddTaskModal";
import { TaskContext } from "../api/TaskContext";
import moment from 'jalali-moment';
import { KhakKhordeIcon, RumizIcon, NobateshMisheIcon } from "../components/Icons"; // <-- Import Icons





function TaskManagementPage() {
    const {
        tasksByCategory,
        loadingByCategory,
        setTasksByCategory,
        addTask,
        editTask,
        deleteTask,
        toggleTask,
        fetchTasksByCategory
    } = useContext(TaskContext);


    const [selectedCategory, setSelectedCategory] = useState('rumiz');
    const tasks = tasksByCategory[selectedCategory] || [];
    const isLoading = loadingByCategory[selectedCategory] || false;
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tabsWrapperRef = useRef(null);
    const tabRefs = useRef({});

    const categories = [
        { id: 'khak_khorde', label: 'خاک خورده', Icon: KhakKhordeIcon },
        { id: 'rumiz',       label: 'رومیز',      Icon: RumizIcon },
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', Icon: NobateshMisheIcon },
    ];

    useEffect(() => {
        fetchTasksByCategory(selectedCategory);
    }, [selectedCategory]);

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



    const handleSaveTask = async (taskData) => {
        try {
            const payload = {
                ...taskData,
            };


            console.log("FINAL PAYLOAD TO BACKEND:", JSON.stringify(payload, null, 2));

            const result = editingTask
                ? await editTask(payload)
                : await addTask(payload);

            if (result?.success) {
                await fetchTasksByCategory(taskData);
                setIsAddTaskModalOpen(false);
                setEditingTask(null);
            }

            return result;
        } catch (error) {
            let errorMsg = 'خطا در ذخیره تسک';

            if (error?.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    errorMsg = data;
                } else if (data.detail) {
                    errorMsg = data.detail;
                } else if (typeof data === 'object') {
                    errorMsg = Object.entries(data)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? JSON.stringify(val) : val}`)
                        .join(' | ');
                }
            } else if (error?.message) {
                errorMsg = error.message;
            }

            return {
                success: false,
                error: errorMsg,
            };
        }
    };







    const handleEditTask = (task) => {
        const originalTask = tasks.find(t => t.id === task.id);
        setEditingTask(originalTask || task);
        setIsAddTaskModalOpen(true);
    };




    const filteredTasks = selectedDate
        ? tasks.filter(task => {
            if (!task?.id) return false;
            const taskDate = task.deadline_date ? moment(task.deadline_date, 'YYYY-MM-DD') : null;
            return taskDate?.format('YYYY-MM-DD') === selectedDate;
        })
        : tasks;

    const formatDateForDisplay = (date) => {
        if (!date) return '';
        const m = moment(date, 'YYYY-MM-DD', true);
        if (!m.isValid()) return '';
        return m.locale('fa').format('jYYYY/jMM/jDD');
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="d-flex task-management-page" dir="rtl">
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="header-placeholder"></div>

                <div className="tab-container">
                    <div className="tabs-wrapper" ref={tabsWrapperRef}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`tab-button ${selectedCategory === cat.id ? 'active' : ''}`}
                                ref={el => tabRefs.current[cat.id] = el}
                            >
                                <span className="tab-icon-wrap">
                                    <cat.Icon />
                                </span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {selectedDate && (
                        <div className="date-filter-info">
                            <span>فیلتر تاریخ: {formatDateForDisplay(selectedDate)}</span>
                            <button className="clear-date-filter-btn" onClick={clearDateFilter}>
                                حذف فیلتر تاریخ
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-grow-1 d-flex flex-column tasks-grid">
                    {isLoading ? (
                        <div className="text-center py-5">در حال بارگذاری از سرور...</div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="empty-message text-center py-5">
                            هیچ تسکی در این دسته یافت نشد
                            <br />
                            تب فعلی: {categories.find(c => c.id === selectedCategory)?.label}
                        </div>
                    ) : (
                        <div className="row gy-4">
                            {filteredTasks.map(task => (
                                <div className="col-12 col-sm-6 col-md-4" key={task.id}>
                                    <TaskCard
                                        task={task}
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
                        onSave={handleSaveTask}
                        initialTask={editingTask}
                        selectedDate={selectedDate}
                    />
                </div>
            )}
        </div>
    );
}

export default TaskManagementPage;
