import React, { useContext } from "react";
import "./TaskPreviewCard.scss";
import { TaskContext } from "../components/TaskContext";
import { LanguageContext } from "../context/LanguageContext";

const cardConfigs = {
  active: {
    color: "#38A3A5",
    icon: "/assets/icons/active.svg",
    labelKey: "taskPreviewCard.active",
  },
  upNext: {
    color: "#57CC99",
    icon: "/assets/icons/up-next.svg",
    labelKey: "taskPreviewCard.upNext",
  },
  archived: {
    color: "#80ED99",
    icon: "/assets/icons/archived.svg",
    labelKey: "taskPreviewCard.archived",
  },
};

function TaskPreviewCard({ cardName, tasks, setSelectedTask }) {
  const { timers, initialDuration, startTimer, stopTimer } = useContext(TaskContext);
  const { t } = useContext(LanguageContext);
  const config = cardConfigs[cardName];

  const filteredTasks = tasks.filter((task) => {
    if (cardName === "active") return task.flag_tuNobat && !task.isDone;
    if (cardName === "upNext") return !task.flag_tuNobat && !task.isDone;
    if (cardName === "archived") return task.isDone;
    return false;
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTaskClick = (task) => {
    const timer = timers[task.id] || { remaining: initialDuration, isRunning: false };
    if (timer.isRunning) {
      stopTimer(task.id);
    } else {
      startTimer(task.id);
    }
    setSelectedTask(task);
  };

  return (
      <div className="task-preview__card" style={{ backgroundColor: config.color }}>
        <div>
          <img src={config.icon} alt="" />
          <span>{t(config.labelKey)}</span>
        </div>
        <div className="task-preview__card-tasks">
          {filteredTasks.length === 0 ? (
              <span>{t("taskPreviewCard.noTasks")}</span>
          ) : (
              filteredTasks.map((task) => {
                const timer = timers[task.id] || { remaining: initialDuration, isRunning: false };
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
                          src={timer.isRunning ? "/assets/icons/pause.svg" : "/assets/icons/Polygon.svg"}
                          alt={timer.isRunning ? "Pause" : "Play"}
                          className="cursor-pointer polygon-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
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