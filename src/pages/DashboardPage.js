import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TaskPreviewCard from "../components/dashboard/TaskPreviewCard";
import UtilitySidebar from "../components/dashboard/UtilitySidebar";
import Calendar from "../components/dashboard/Calendar";
import MobileBottomBar from "../components/dashboard/MobileBottomBar";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import AddTaskModal from "../components/taskmanagement/AddTaskModal";
import { TaskContext } from "../api/TaskContext";
import { LanguageContext } from "../context/LanguageContext";
import "./DashboardPage.scss";

function DashboardPage() {
    const { timers, addTask, refreshAllCategories } = useContext(TaskContext);
    const { t } = useContext(LanguageContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [timerDuration, setTimerDuration] = useState(
        location.state?.timerDuration || localStorage.getItem("timerDuration") || "5"
    );

    useEffect(() => {
        const handleStorageChange = () => {
            const stored = localStorage.getItem("timerDuration");
            if (stored && stored !== timerDuration) setTimerDuration(stored);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [timerDuration]);

    const handleSaveTask = async (taskData) => {
        try {
            const result = await addTask(taskData);

            if (result?.success) {
                await refreshAllCategories();
                setShowModal(false);
                navigate("/task-management");
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

    return (
        <div className="dashboard-page d-flex">
            <UtilitySidebar
                selectedTask={selectedTask}
                selectedDate={selectedDate}
                onAddTaskClick={() => setShowModal(true)}
            />
            <main className="main-content d-flex flex-column align-items-center w-100">
                <div className="task-cards-container">
                    {["archived", "upNext", "active"].map(cardName => (
                        <TaskPreviewCard
                            key={cardName}
                            cardName={cardName}
                            setSelectedTask={setSelectedTask}
                            selectedTask={selectedTask}
                            timerDuration={timerDuration}
                        />
                    ))}
                </div>

                <h2 className="section-title">{t("dashboard.chartCalendar")}</h2>

                <div className="bottom-section">
                    <div className="chart-wrapper">
                        <WeeklyChart />
                    </div>
                    <div className="calendar-wrapper">
                        <div className="calendar-container-wrapper">
                            <Calendar />
                        </div>
                    </div>
                </div>
            </main>
            <MobileBottomBar
                selectedTask={selectedTask}
                onAddTaskClick={() => setShowModal(true)}
            />

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <AddTaskModal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onSave={handleSaveTask}
                            selectedDate={selectedDate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;