import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TaskPreviewCard from "../components/TaskPreviewCard";
import UtilitySidebar from "../components/UtilitySidebar";
import SidebarMenu from "../components/SidebarMenu";
import TaskProgressChart from "../components/TaskProgressChart";
import Calendar from "../components/Calendar";
import { TaskContext } from "../components/TaskContext";
import { LanguageContext } from "../context/LanguageContext";
import "./DashboardPage.scss";

function DashboardPage() {
    const { tasks, timers } = useContext(TaskContext);
    const { t } = useContext(LanguageContext);
    const location = useLocation();
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timerDuration, setTimerDuration] = useState(
        location.state?.timerDuration || localStorage.getItem("timerDuration") || "5"
    );

    const weeklyProgress = [
        { day: t("dashboard.day.saturday"), progress: 80 },
        { day: t("dashboard.day.sunday"), progress: 60 },
        { day: t("dashboard.day.monday"), progress: 90 },
        { day: t("dashboard.day.tuesday"), progress: 50 },
        { day: t("dashboard.day.wednesday"), progress: 70 },
        { day: t("dashboard.day.thursday"), progress: 100 },
        { day: t("dashboard.day.friday"), progress: 40 },
    ];

    useEffect(() => {
        const handleStorageChange = () => {
            const storedDuration = localStorage.getItem("timerDuration");
            if (storedDuration && storedDuration !== timerDuration) {
                setTimerDuration(storedDuration);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [timerDuration]);

    useEffect(() => {
        if (selectedTask && timerDuration) {
            const timer = timers[selectedTask.id];
            if (!timer || !timer.isRunning) {
                // اینجا می‌توانید timerDuration را به TaskContext یا کامپوننت تایمر منتقل کنید
            }
        }
    }, [selectedTask, timers, timerDuration]);

    return (
        <div className="dashboard-page d-flex">
            <UtilitySidebar selectedTask={selectedTask} selectedDate={selectedDate} />
            <main className="main-content d-flex flex-column align-items-center w-100 gap-4">
                <div className="d-flex justify-content-center gap-4 mt-5">
                    <TaskPreviewCard
                        cardName="archived"
                        tasks={tasks}
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration}
                    />
                    <TaskPreviewCard
                        cardName="upNext"
                        tasks={tasks}
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration}
                    />
                    <TaskPreviewCard
                        cardName="active"
                        tasks={tasks}
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration}
                    />
                </div>
                <span className="mb-2">{t("dashboard.chartCalendar")}</span>
                <div
                    className="w-100 d-flex align-items-center justify-content-center gap-5"
                    style={{ margin: "0 40px" }}
                >
                    <div className="chart-container">
                        <TaskProgressChart data={weeklyProgress} width={400} height={300} />
                    </div>
                    <div className="calendar-container-wrapper">
                        <Calendar />
                    </div>
                </div>
            </main>
            <SidebarMenu />
        </div>
    );
}

export default DashboardPage;