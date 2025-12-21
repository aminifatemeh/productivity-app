import React, { useContext } from "react";
import "./TaskPreviewCard.scss";
import { TaskContext } from "../components/TaskContext";
import { LanguageContext } from "../context/LanguageContext";

const cardConfigs = {
  active: {
    color: "#38A3A5",
    icon: "/assets/icons/active.svg",
    labelKey: "taskPreviewCard.active",
    gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
  },
  upNext: {
    color: "#57CC99",
    icon: "/assets/icons/up-next.svg",
    labelKey: "taskPreviewCard.upNext",
    gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
  },
  archived: {
    color: "#80ED99",
    icon: "/assets/icons/archived.svg",
    labelKey: "taskPreviewCard.archived",
    gradient: "linear-gradient(135deg, #80ED99 0%, #96F5AF 100%)",
  },
};

function TaskPreviewCard({ cardName, tasks = [], setSelectedTask }) {
  const { timers, startTimer, stopTimer, setTimers } = useContext(TaskContext);
  const { t } = useContext(LanguageContext);
  const config = cardConfigs[cardName] || cardConfigs.active;

  const filteredTasks = (tasks || []).filter((task) => {
    if (!task || !task.id) return false;
    if (cardName === "active") return task.flag_tuNobat && !task.isDone;
    if (cardName === "upNext") return !task.flag_tuNobat && !task.isDone;
    if (cardName === "archived") return task.isDone;
    return false;
  });

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTaskClick = (task) => {
    if (!task || !task.id) return;

    if (!timers[task.id]) {
      setTimers(prev => ({
        ...prev,
        [task.id]: { elapsed: 0, isRunning: false }
      }));
    }

    const timer = timers[task.id] || { elapsed: 0, isRunning: false };

    if (timer.isRunning) {
      stopTimer(task.id);
    } else {
      startTimer(task.id);
    }

    if (setSelectedTask) {
      setSelectedTask(task);
    }
  };

  return (
      <div className="task-preview__card" style={{ background: config.gradient }}>
        <div className="task-preview__card-header">
          <div className="header-content">
            <img src={config.icon} alt="" className="header-icon" />
            <span className="header-title">{t(config.labelKey)}</span>
          </div>
          <div className="task-count-badge">{filteredTasks.length}</div>
        </div>

        <div className="task-preview__card-tasks">
          {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <span>{t("taskPreviewCard.noTasks")}</span>
              </div>
          ) : (
              filteredTasks.map((task) => {
                if (!task || !task.id) return null;

                const timer = timers[task.id] || { elapsed: 0, isRunning: false };
                const totalTime = (task.totalDuration || 0) + timer.elapsed;
                const maxDuration = 3600;
                const progress = Math.min((totalTime / maxDuration) * 100, 100);

                return (
                    <div
                        key={task.id}
                        className={`task-preview__card-task ${timer.isRunning ? 'is-running' : ''}`}
                        style={{ "--progress": `${progress}%` }}
                        onClick={() => setSelectedTask && setSelectedTask(task)}
                    >
                      <div className="task-content">
                        <div className="task-indicator"></div>
                        <div className="task-info">
                    <span className="task-title" title={task.title || "Untitled"}>
                      {task.title || "Untitled"}
                    </span>
                          {totalTime > 0 && (
                              <span className="task-time">
                        {formatTime(totalTime)}
                      </span>
                          )}
                        </div>
                      </div>
                      <button
                          className={`task-action-btn ${timer.isRunning ? 'is-active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                          aria-label={timer.isRunning ? "Pause" : "Play"}
                      >
                        {timer.isRunning ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <rect x="4" y="3" width="3" height="10" rx="1" />
                              <rect x="9" y="3" width="3" height="10" rx="1" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M5 3L13 8L5 13V3Z" />
                            </svg>
                        )}
                      </button>
                    </div>
                );
              }).filter(Boolean)
          )}
        </div>
      </div>
  );
}

export default TaskPreviewCard;