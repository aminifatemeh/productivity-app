import React, { useContext, useState } from "react";
import TaskPreviewCard from "../components/TaskPreviewCard";
import UtilitySidebar from "../components/UtilitySidebar";
import SidebarMenu from "../components/SidebarMenu";
import TaskProgressChart from "../components/TaskProgressChart";
import Example from "../components/Calendar";
import { TaskContext } from "../components/TaskContext";

function DashboardPage() {
    const { tasks } = useContext(TaskContext);
    const [selectedTask, setSelectedTask] = useState(null);

    const weeklyProgress = [
        { day: "Saturday", progress: 80 },
        { day: "Sunday", progress: 60 },
        { day: "Monday", progress: 90 },
        { day: "Tuesday", progress: 50 },
        { day: "Wednesday", progress: 70 },
        { day: "Thursday", progress: 100 },
        { day: "Friday", progress: 40 },
    ];

    return (
        <div className="d-flex" style={{ marginLeft: "321px" }}>
            <UtilitySidebar selectedTask={selectedTask} />
            <SidebarMenu />
            <main className="d-flex flex-column align-items-center w-100 gap-4">
                <div className="d-flex justify-content-center gap-4 mt-5">
                    <TaskPreviewCard cardName="active" tasks={tasks} setSelectedTask={setSelectedTask} />
                    <TaskPreviewCard cardName="upNext" tasks={tasks} setSelectedTask={setSelectedTask} />
                    <TaskPreviewCard cardName="archived" tasks={tasks} setSelectedTask={setSelectedTask} />
                </div>
                <span className="mb-2">نمودار وضعیت - تقویم</span>
                <div className="w-100 d-flex align-items-start me-5">
                    <TaskProgressChart data={weeklyProgress} />
                    <Example />
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;