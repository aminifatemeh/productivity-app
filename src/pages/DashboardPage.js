import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TaskPreviewCard from "../components/TaskPreviewCard";
import UtilitySidebar from "../components/UtilitySidebar";
import SidebarMenu from "../components/SidebarMenu";
import TaskProgressChart from "../components/TaskProgressChart";
import Calendar from "../components/Calendar";
import { TaskContext } from "../components/TaskContext";

function DashboardPage() {
    const { tasks, timers } = useContext(TaskContext);
    const location = useLocation();
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timerDuration, setTimerDuration] = useState(
        location.state?.timerDuration || localStorage.getItem("timerDuration") || "5"
    );

    const weeklyProgress = [
        { day: "Saturday", progress: 80 },
        { day: "Sunday", progress: 60 },
        { day: "Monday", progress: 90 },
        { day: "Tuesday", progress: 50 },
        { day: "Wednesday", progress: 70 },
        { day: "Thursday", progress: 100 },
        { day: "Friday", progress: 40 },
    ];

    // به‌روزرسانی timerDuration در صورت تغییر در localStorage
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

    // به‌روزرسانی تایمرها در صورت تغییر timerDuration
    useEffect(() => {
        if (selectedTask && timerDuration) {
            const timer = timers[selectedTask.id];
            if (!timer || !timer.isRunning) {
                // اینجا می‌توانید timerDuration را به TaskContext یا کامپوننت تایمر منتقل کنید
                // فرض می‌کنیم TaskContext یک متد برای به‌روزرسانی timerDuration دارد
                // یا مستقیماً در TaskPreviewCard/PomodoroClock استفاده می‌شود
            }
        }
    }, [selectedTask, timers, timerDuration]);

    return (
        <div className="d-flex" style={{ marginLeft: "321px" }}>
            <UtilitySidebar selectedTask={selectedTask} selectedDate={selectedDate} />
            <SidebarMenu />
            <main className="d-flex flex-column align-items-center w-100 gap-4">
                <div className="d-flex justify-content-center gap-4 mt-5">
                    <TaskPreviewCard
                        cardName="archived"
                        tasks={tasks}
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration} // ارسال timerDuration به TaskPreviewCard
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
                <span className="mb-2">نمودار وضعیت - تقویم</span>
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
        </div>
    );
}

export default DashboardPage;