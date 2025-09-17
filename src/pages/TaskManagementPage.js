import React, { useState } from "react";
import './TaskManagementPage.scss';
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import TaskComponent from "../api/api";

function TaskManagementPage() {
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('khak_khorde');

    const defaultTasks = [
        {
            id: 1,
            title: "تسک نمونه ۱",
            description: "این یک تسک نمونه است",
            deadline_date: "۱۴۰۴/۰۶/۳۱",
            flag_tuNobat: false,
            hour: "10:00",
            selectedDays: [],
            tags: [{ name: "کار", color: "#DA348D", selected: true }],
            subtasks: [
                { id: 1, title: "ساب‌تسک ۱", done_date: null },
                { id: 2, title: "ساب‌تسک ۲", done_date: "۱۴۰۴/۰۵/۳۰" },
            ],
        },
        {
            id: 2,
            title: "تسک نمونه ۲",
            description: "این یک تسک نمونه دیگر است",
            deadline_date: "۱۴۰۴/۰۷/۱۵",
            flag_tuNobat: true,
            hour: "14:00",
            selectedDays: ["ش", "ی"],
            tags: [{ name: "ورزش", color: "#34AA7B", selected: true }],
            subtasks: [
                { id: 3, title: "ساب‌تسک ۳", done_date: null },
            ],
        },
        {
            id: 3,
            title: "تسک نمونه ۳",
            description: "تسک نمونه برای تست",
            deadline_date: "۱۴۰۴/۰۸/۰۱",
            flag_tuNobat: false,
            hour: "09:00",
            selectedDays: [],
            tags: [],
            subtasks: [],
        },
    ];

    const handleTasksFetched = (fetchedTasks, error = false) => {
        console.log('Tasks fetched:', fetchedTasks, 'Error:', error);
        if (error || !Array.isArray(fetchedTasks) || fetchedTasks.length === 0) {
            setTasks(defaultTasks);
        } else {
            // Ensure fetched tasks have all required fields
            const normalizedTasks = fetchedTasks.map(task => ({
                ...task,
                hour: task.hour || "00:00",
                selectedDays: task.selectedDays || [],
                tags: task.tags || [],
                subtasks: task.subtasks || [],
            }));
            setTasks(normalizedTasks);
        }
    };

    const handleTaskAdded = (newTask) => {
        console.log('New task added:', newTask);
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const handleUpdateTask = (updatedTask) => {
        console.log('Task updated:', updatedTask);
        setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    };

    const handleDeleteTask = (taskId) => {
        console.log('Task deleted:', taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    const categories = [
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', icon: "/assets/icons/nobatesh_mishe_icon.svg" },
        { id: 'rumiz', label: 'رومیزی', icon: "/assets/icons/rumiz_icon.svg" },
        { id: 'khak_khorde', label: 'خاک خورده', icon: "/assets/icons/khakhorde_icon.svg" },
    ];

    return (
        <div className="d-flex task-management-page">
            <SidebarMenu />
            <div className="d-flex flex-column flex-grow-1">
                <div className="header-placeholder"></div>
                <div className="tab-container">
                    <div className="tabs-wrapper">
                        {categories.map((category, index) => (
                            <React.Fragment key={category.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`tab-button ${selectedCategory === category.id ? 'active' : ''}`}
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
                </div>
                <TaskComponent category={selectedCategory} onTasksFetched={handleTasksFetched} />
                <div
                    className={`flex-grow-1 d-flex flex-column tasks-grid ${showModal ? 'overflow-hidden' : ''}`}
                >
                    {tasks.length === 0 ? (
                        <div className="empty-message">
                            هیچ تسکی برای نمایش وجود ندارد
                        </div>
                    ) : (
                        <div className="row gy-4">
                            {tasks
                                .filter((task) => {
                                    if (selectedCategory === 'nobatesh_mishe') return task.flag_tuNobat;
                                    if (selectedCategory === 'rumiz') return !task.flag_tuNobat;
                                    if (selectedCategory === 'khak_khorde') return !task.flag_tuNobat; // TODO: Differentiate rumiz and khak_khorde
                                    return true;
                                })
                                .map((task) => (
                                    <div className="col-12 col-sm-6 col-md-4" key={task.id}>
                                        <TaskCard
                                            task={task}
                                            onUpdateTask={handleUpdateTask}
                                            onDeleteTask={handleDeleteTask}
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                    {showModal && (
                        <div className="d-flex justify-content-center align-items-center modal-overlay">
                            <AddTaskModal
                                isOpen={showModal}
                                onClose={() => setShowModal(false)}
                                onTaskAdded={handleTaskAdded}
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