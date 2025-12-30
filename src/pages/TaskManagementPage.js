// pages/TaskManagementPage.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TaskManagementPage.scss';
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { TaskContext } from "../components/TaskContext";
import moment from 'jalali-moment';

function TaskManagementPage() {
    const {
        tasks,
        setTasks,
        editTask,
        deleteTask,
        toggleTask,
        isLoading,
        fetchTasksByCategory
    } = useContext(TaskContext);

    const [selectedCategory, setSelectedCategory] = useState('khak_khorde');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tabsWrapperRef = useRef(null);
    const tabRefs = useRef({});

    console.log('تمام تسک‌های موجود در کانتکست (TaskManagementPage):', tasks.map(t => ({
        id: t.id,
        title: t.title,
        deadline_date: t.deadline_date,
        isDone: t.isDone,
        flag_tuNobat: t.flag_tuNobat
    })));

    // Fetch tasks when category changes
    useEffect(() => {
        fetchTasksByCategory(selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get('date');
        console.log('تاریخ انتخاب‌شده از URL:', date);
        setSelectedDate(date || null);
    }, [location.search]);

    useEffect(() => {
        if (location.state?.openEditModalFor) {
            const taskId = location.state.openEditModalFor;
            console.log('درخواست ویرایش تسک با آیدی:', taskId);
            const taskToEdit = tasks.find(t => t.id === taskId);
            if (taskToEdit) {
                console.log('تسک یافت شد برای ویرایش:', taskToEdit.title);
                // ارسال تسک اصلی با تاریخ میلادی
                setEditingTask(taskToEdit);
                setIsAddTaskModalOpen(true);
                navigate(location.pathname, { replace: true, state: {} });
            } else {
                console.log('تسک با این آیدی یافت نشد:', taskId);
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
        console.log('فیلتر تاریخ حذف شد');
        setSelectedDate(null);
        navigate('/task-management');
    };

    const handleAddTask = async (newTask) => {
        console.log('تسک جدید اضافه شد:', newTask);
        const token = localStorage.getItem('accessToken');
        if (token) {
            // آنلاین — توسط AddTaskModal و addTask در کانتکست مدیریت میشه
            // بعد از اضافه شدن، تسک‌ها از سرور دوباره fetch میشن
        } else {
            // حالت آفلاین
            const userId = localStorage.getItem('userId') || 'offline_user';
            const newId = Date.now().toString(36) + '_' + Math.random().toString(36).substr(2);
            const taskToSave = { ...newTask, id: newId, isDone: false, originalIndex: tasks.length };
            const updated = [...tasks, taskToSave];
            localStorage.setItem(`tasks_${userId}`, JSON.stringify(updated));
            setTasks(updated);
        }
        setIsAddTaskModalOpen(false);
        setEditingTask(null);
    };

    const handleEditTask = (task) => {
        console.log('درخواست ویرایش تسک:', task.title);
        console.log('تاریخ تسک برای ویرایش (میلادی):', task.deadline_date);

        // Find original task from tasks array to ensure we have the correct date format
        const originalTask = tasks.find(t => t.id === task.id);

        // Use original task data which has dates in Gregorian format
        setEditingTask(originalTask || task);
        setIsAddTaskModalOpen(true);
    };

    const handleTaskUpdated = async (updatedTask) => {
        console.log('تسک آپدیت شد:', updatedTask);
        await editTask(updatedTask);
        setIsAddTaskModalOpen(false);
        setEditingTask(null);
    };

    const categories = [
        { id: 'khak_khorde', label: 'خاک خورده', icon: "/assets/icons/khak_khorde_icon.svg" },
        { id: 'rumiz', label: 'رومیز', icon: "/assets/icons/rumiz_icon.svg" },
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', icon: "/assets/icons/nobatesh_mishe_icon.svg" },
    ];

    // Filter tasks by selected date only (category filtering is done by API now)
    const filteredTasks = selectedDate
        ? tasks.filter(task => {
            if (!task?.id) return false;
            const taskDate = task.deadline_date ? moment(task.deadline_date, 'YYYY-MM-DD') : null;
            const match = taskDate?.format('YYYY-MM-DD') === selectedDate;
            console.log(`فیلتر تاریخ برای تسک "${task.title}":`, match);
            return match;
        })
        : tasks;

    console.log('تسک‌های نهایی نمایش‌داده‌شده:', filteredTasks.map(t => t.title));

    const formatDateForDisplay = (date) => {
        if (!date) return '';
        const m = moment(date, 'YYYY-MM-DD', true);
        if (!m.isValid()) {
            console.log('تاریخ نامعتبر برای تبدیل:', date);
            return '';
        }
        const formatted = m.locale('fa').format('jYYYY/jMM/jDD');
        console.log('تبدیل تاریخ برای نمایش:', date, '→', formatted);
        return formatted;
    };

    const handleCategoryChange = (categoryId) => {
        console.log('تغییر تب به:', categoryId);
        setSelectedCategory(categoryId);
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
                                    onClick={() => handleCategoryChange(cat.id)}
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
                            console.log('باز شدن مودال افزودن تسک جدید');
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
                            console.log('بستن مودال تسک');
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