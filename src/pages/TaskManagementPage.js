// pages/TaskManagementPage.js
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TaskManagementPage.scss';
import TaskCard from "../components/taskmanagement/TaskCard";
import AddTaskModal from "../components/taskmanagement/AddTaskModal";
import { TaskContext } from "../api/TaskContext";
import moment from 'jalali-moment';

const KhakKhordeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* مرکز */}
        <circle cx="12" cy="12" r="1.2" fill="currentColor"/>
        {/* خطوط شعاعی */}
        <line x1="12" y1="12" x2="12" y2="3" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="19.5" y2="7.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="19.5" y2="16.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="12" y2="21" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="12" y1="12" x2="4.5" y2="16.5" stroke="currentColor" strokeWidth="1.2"/><line x1="12" y1="12" x2="4.5" y2="7.5" stroke="currentColor" strokeWidth="1.2"/>
        {/* حلقه‌های تار */}
        <path d="M12 6 Q15.5 9 15.5 12 Q15.5 15 12 18 Q8.5 15 8.5 12 Q8.5 9 12 6Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        <path d="M12 3.5 Q18 7.5 18 12 Q18 16.5 12 20.5 Q6 16.5 6 12 Q6 7.5 12 3.5Z" stroke="currentColor" strokeWidth="1" fill="none"/>
    </svg>
);

const RumizIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* صفحه میز */}
        <rect x="2" y="10" width="20" height="2.5" rx="1.2" stroke="currentColor" strokeWidth="1.5"/>
        {/* پایه چپ */}
        <line x1="6" y1="12.5" x2="5" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        {/* پایه راست */}
        <line x1="18" y1="12.5" x2="19" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        {/* اتصال پایه‌ها */}
        <line x1="5.3" y1="17" x2="18.7" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
);

const NobateshMisheIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* خط بالا و پایین */}
        <line x1="7" y1="3" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="7" y1="21" x2="17" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        {/* بدنه ساعت شنی */}
        <path d="M8 3 C8 3 8 8 12 12 C16 16 16 21 16 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M16 3 C16 3 16 8 12 12 C8 16 8 21 8 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        {/* شن پایین */}
        <path d="M9.5 19.5 Q12 17.5 14.5 19.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
);


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

    const [selectedCategory, setSelectedCategory] = useState('rumiz');
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

    const handleAddTask = async (newTask) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
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
        const originalTask = tasks.find(t => t.id === task.id);
        setEditingTask(originalTask || task);
        setIsAddTaskModalOpen(true);
    };

    const handleTaskUpdated = async (updatedTask) => {
        await editTask(updatedTask);
        setIsAddTaskModalOpen(false);
        setEditingTask(null);
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
