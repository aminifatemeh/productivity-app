import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TaskPreviewCard from "../components/dashboard/TaskPreviewCard";
import UtilitySidebar from "../components/dashboard/UtilitySidebar";
import Calendar from "../components/dashboard/Calendar";
import MobileTimerBar from "../components/dashboard/MobileTimerBar";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import { TaskContext } from "../api/TaskContext";
import { LanguageContext } from "../context/LanguageContext";
import "./DashboardPage.scss";

function DashboardPage() {
    const { timers } = useContext(TaskContext);
    const { t } = useContext(LanguageContext);
    const location = useLocation();
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
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

    return (
        <div className="dashboard-page d-flex"><UtilitySidebar selectedTask={selectedTask} selectedDate={selectedDate} />
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
            <MobileTimerBar selectedTask={selectedTask} />
        </div>
    );
}

export default DashboardPage;
