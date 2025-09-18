import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TaskManagementPage.scss';
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import { TaskContext } from "../components/TaskContext";

function TaskManagementPage() {
    const { tasks, setTasks } = useContext(TaskContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('khak_khorde');
    const [editTask, setEditTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tabsWrapperRef = useRef(null); // رفرنس به tabs-wrapper
    const tabRefs = useRef({}); // رفرنس به هر تب

    // خواندن تاریخ از query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const date = params.get('date');
        setSelectedDate(date || null);
    }, [location.search]);

    // مدیریت موقعیت و عرض مستطیل متحرک
    useEffect(() => {
        const activeTab = tabRefs.current[selectedCategory];
        if (activeTab && tabsWrapperRef.current) {
            const { offsetLeft, offsetWidth } = activeTab;
            const tabsWrapper = tabsWrapperRef.current;
            tabsWrapper.style.setProperty('--slider-left', `${offsetLeft}px`);
            tabsWrapper.style.setProperty('--slider-width', `${offsetWidth}px`);
        }
    }, [selectedCategory]);

    const handleTaskAdded = (newTask) => {
        console.log('New task added:', newTask);
        setTasks((prevTasks) => [...prevTasks, { ...newTask, isDone: false }]);
        setShowModal(false);
    };

    const handleUpdateTask = (updatedTask) => {
        console.log('Task updated:', updatedTask);
        setTasks((prevTasks) => {
            const otherTasks = prevTasks.filter((task) => task.id !== updatedTask.id);
            return [...otherTasks, { ...updatedTask, subtasks: updatedTask.subtasks || [] }];
        });
        setEditTask(null);
    };

    const handleDeleteTask = (taskId) => {
        console.log('Task deleted:', taskId);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    const handleEditTask = (task) => {
        setEditTask({ ...task, subtasks: task.subtasks || [] });
    };

    const clearDateFilter = () => {
        setSelectedDate(null);
        navigate('/task-management');
    };

    const categories = [
        { id: 'khak_khorde', label: 'خاک خورده', icon: "/assets/icons/khakhorde_icon.svg" },
        { id: 'rumiz', label: 'رومیزی', icon: "/assets/icons/rumiz_icon.svg" },
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', icon: "/assets/icons/nobatesh_mishe_icon.svg" },
    ];

    const filteredTasks = tasks.filter((task) => {
        if (selectedDate && task.deadline_date !== selectedDate) {
            return false;
        }
        if (selectedCategory === 'nobatesh_mishe') return task.flag_tuNobat && !task.isDone;
        if (selectedCategory === 'khak_khorde') return !task.flag_tuNobat && !task.isDone;
        if (selectedCategory === 'rumiz') return !task.isDone;
        return true;
    });

    return (
        <div className="d-flex task-management-page">
            <SidebarMenu />
            <div className="d-flex flex-column flex-grow-1">
                <div className="header-placeholder"></div>
                <div className="tab-container">
                    <div className="tabs-wrapper" ref={tabsWrapperRef}>
                        {categories.map((category, index) => (
                            <React.Fragment key={category.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`tab-button ${selectedCategory === category.id ? 'active' : ''}`}
                                    ref={(el) => (tabRefs.current[category.id] = el)} // رفرنس به تب
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
                            <span>نمایش تسک‌های تاریخ: {selectedDate}</span>
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
                <div
                    className={`flex-grow-1 d-flex flex-column tasks-grid ${showModal || editTask ? 'overflow-hidden' : ''}`}
                >
                    {filteredTasks.length === 0 ? (
                        <div className="empty-message">
                            هیچ تسکی برای نمایش وجود ندارد
                        </div>
                    ) : (
                        <div className="row gy-4">
                            {filteredTasks.map((task) => (
                                <div className="col-12 col-sm-6 col-md-4" key={task.id}>
                                    <TaskCard
                                        task={task}
                                        onUpdateTask={handleUpdateTask}
                                        onDeleteTask={handleDeleteTask}
                                        onEditTask={handleEditTask}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    {showModal && (
                        <div className="modal-overlay">
                            <AddTaskModal
                                isOpen={showModal}
                                onClose={() => setShowModal(false)}
                                onTaskAdded={handleTaskAdded}
                            />
                        </div>
                    )}
                    {editTask && (
                        <div className="modal-overlay">
                            <AddTaskModal
                                isOpen={!!editTask}
                                onClose={() => setEditTask(null)}
                                onTaskAdded={handleUpdateTask}
                                initialTask={editTask}
                            />
                        </div>
                    )}
                </div>
                <div className="d-flex w-100 justify-content-center align-items-center">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="add-task-button"
                    >
                        افزودن تسک
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskManagementPage;