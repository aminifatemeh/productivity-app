import React, { useContext } from "react";
import "./TaskPreviewCard.scss";
import { TaskContext } from "../components/TaskContext";

const cardConfigs = {
  active: {
    color: "#38A3A5",
    icon: "/assets/icons/active.svg",
    label: "نوبتش میشه",
  },
  upNext: {
    color: "#57CC99",
    icon: "/assets/icons/up-next.svg",
    label: "روی میز",
  },
  archived: {
    color: "#80ED99",
    icon: "/assets/icons/archived.svg",
    label: "خاک خورده",
  },
};

function TaskPreviewCard({ cardName, tasks, setSelectedTask }) {
  const { timers, initialDuration } = useContext(TaskContext);
  const config = cardConfigs[cardName];

  // Filter tasks based on cardName
  const filteredTasks = tasks.filter((task) => {
    if (cardName === "active") return task.flag_tuNobat && !task.isDone;
    if (cardName === "upNext") return !task.flag_tuNobat && !task.isDone;
    if (cardName === "archived") return task.isDone;
    return false;
  });

  // Helper to format remaining time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
      <div className="task-preview__card" style={{ backgroundColor: config.color }}>
        <div>
          <img src={config.icon} alt="" />
          <span>{config.label}</span>
        </div>
        <div className="task-preview__card-tasks">
          {filteredTasks.length === 0 ? (
              <span>هیچ تسکی موجود نیست</span>
          ) : (
              filteredTasks.map((task) => {
                const timer = timers[task.id] || { remaining: initialDuration };
                const progress = initialDuration > 0
                    ? Math.min(((initialDuration - timer.remaining) / initialDuration) * 100, 100)
                    : 0;
                return (
                    <div
                        key={task.id}
                        className="task-preview__card-task"
                        style={{ "--progress": `${progress}%` }}
                    >
                      <div className="circle"></div>
                      <span>{task.title}</span>
                      <img
                          src="/assets/icons/Polygon.svg"
                          alt="Select Task"
                          className="cursor-pointer polygon-icon"
                          onClick={() => setSelectedTask(task)}
                      />
                    </div>
                );
              })
          )}
        </div>
      </div>
  );
}

export default TaskPreviewCard;