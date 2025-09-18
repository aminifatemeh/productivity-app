import React, { useState, useContext } from "react";
import './TaskManagementPage.scss';
import SidebarMenu from "../components/SidebarMenu";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import TaskComponentApi from "../api/TaskComponentApi";
import { TaskContext } from "../components/TaskContext";

function TaskManagementPage({ useApi = true }) {
    const { tasks, setTasks } = useContext(TaskContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('khak_khorde');
    const [editTask, setEditTask] = useState(null);

    const defaultTasks = [
        {
            id: 1,
            title: "تهیه گزارش ماهانه پروژه",
            description: "جمع‌آوری داده‌های فروش و تهیه گزارش برای جلسه تیم مدیریت",
            deadline_date: "۱۴۰۴/۰۷/۱۰",
            flag_tuNobat: false,
            hour: "09:30",
            selectedDays: [],
            tags: [{ name: "کار", color: "#DA348D", selected: true }],
            subtasks: [
                { id: 1, title: "جمع‌آوری داده‌های فروش", done_date: null },
                { id: 2, title: "تحلیل داده‌ها", done_date: null },
                { id: 3, title: "طراحی اسلایدها", done_date: "۱۴۰۴/۰۶/۳۰" },
            ],
            isDone: false,
        },
        {
            id: 2,
            title: "تمرین برنامه‌نویسی پایتون",
            description: "تمرین پروژه جنگو برای بهبود مهارت‌های کدنویسی",
            deadline_date: "۱۴۰۴/۰۷/۱۵",
            flag_tuNobat: true,
            hour: "18:00",
            selectedDays: ["ش", "د", "چ"],
            tags: [
                { name: "تحصیل", color: "#4690E4", selected: true },
                { name: "برنامه‌نویسی", color: "#34AA7B", selected: true },
            ],
            subtasks: [
                { id: 4, title: "یادگیری مدل‌های جنگو", done_date: null },
                { id: 5, title: "ساخت یک API ساده", done_date: null },
            ],
            isDone: false,
        },
        {
            id: 3,
            title: "خرید مواد غذایی هفتگی",
            description: "خرید مواد لازم برای آشپزی هفته آینده",
            deadline_date: "۱۴۰۴/۰۶/۳۱",
            flag_tuNobat: false,
            hour: "16:00",
            selectedDays: [],
            tags: [{ name: "شخصی", color: "#FFCA28", selected: true }],
            subtasks: [
                { id: 6, title: "تهیه لیست خرید", done_date: "۱۴۰۴/۰۶/۲۹" },
                { id: 7, title: "بازدید از سوپرمارکت", done_date: null },
            ],
            isDone: true,
        },
        {
            id: 4,
            title: "تمرین بدنسازی",
            description: "جلسه تمرین در باشگاه برای تقویت عضلات",
            deadline_date: "۱۴۰۴/۰۷/۱۲",
            flag_tuNobat: true,
            hour: "17:30",
            selectedDays: ["ی", "س", "پ"],
            tags: [{ name: "ورزش", color: "#34AA7B", selected: true }],
            subtasks: [
                { id: 8, title: "گرم کردن", done_date: null },
                { id: 9, title: "تمرینات بالاتنه", done_date: null },
                { id: 10, title: "سرد کردن", done_date: null },
            ],
            isDone: false,
        },
        {
            id: 5,
            title: "مطالعه کتاب مدیریت زمان",
            description: "خواندن فصل‌های ۵ تا ۷ برای امتحان هفته آینده",
            deadline_date: "۱۴۰۴/۰۷/۰۸",
            flag_tuNobat: false,
            hour: "20:00",
            selectedDays: [],
            tags: [{ name: "تحصیل", color: "#4690E4", selected: true }],
            subtasks: [
                { id: 11, title: "خواندن فصل ۵", done_date: "۱۴۰۴/۰۶/۲۸" },
                { id: 12, title: "یادداشت‌برداری فصل ۶", done_date: null },
            ],
            isDone: false,
        },
    ];

    const handleTasksFetched = (fetchedTasks, error = false) => {
        console.log('Tasks fetched:', fetchedTasks, 'Error:', error);
        const normalizedTasks = fetchedTasks.map(task => ({
            ...task,
            hour: task.hour || "00:00",
            selectedDays: task.selectedDays || [],
            tags: task.tags || [],
            subtasks: task.subtasks?.map(subtask => ({
                ...subtask,
                done_date: subtask.done_date || null
            })) || [],
            isDone: task.isDone || false,
        }));
        setTasks(normalizedTasks);
    };

    const handleTaskAdded = (newTask) => {
        console.log('New task added:', newTask);
        setTasks(prevTasks => [...prevTasks, { ...newTask, isDone: false }]);
    };

    const handleUpdateTask = (updatedTask) => {
        console.log('Task updated:', updatedTask);
        setTasks(prevTasks => {
            const otherTasks = prevTasks.filter(task => task.id !== updatedTask.id);
            return [...otherTasks, { ...updatedTask, subtasks: updatedTask.subtasks || [] }];
        });
        setEditTask(null);
    };

    const handleDeleteTask = (taskId) => {
        console.log('Task deleted:', taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    };

    const handleEditTask = (task) => {
        setEditTask({ ...task, subtasks: task.subtasks || [] });
    };

    const categories = [
        { id: 'khak_khorde', label: 'خاک خورده', icon: "/assets/icons/khakhorde_icon.svg" },
        { id: 'rumiz', label: 'رومیزی', icon: "/assets/icons/rumiz_icon.svg" },
        { id: 'nobatesh_mishe', label: 'نوبتش میشه', icon: "/assets/icons/nobatesh_mishe_icon.svg" },
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
                <TaskComponentApi
                    category={selectedCategory}
                    onTasksFetched={handleTasksFetched}
                    useApi={useApi}
                    defaultTasks={defaultTasks}
                />
                <div
                    className={`flex-grow-1 d-flex flex-column tasks-grid ${showModal || editTask ? 'overflow-hidden' : ''}`}
                >
                    {tasks.length === 0 ? (
                        <div className="empty-message">
                            هیچ تسکی برای نمایش وجود ندارد
                        </div>
                    ) : (
                        <div className="row gy-4">
                            {tasks
                                .filter((task) => {
                                    if (selectedCategory === 'nobatesh_mishe') return task.flag_tuNobat && !task.isDone;
                                    if (selectedCategory === 'khak_khorde') return !task.flag_tuNobat && !task.isDone;
                                    if (selectedCategory === 'rumiz') return !task.isDone; // فقط تسک‌های غیرتکمیل‌شده
                                    return true;
                                })
                                .map((task) => (
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