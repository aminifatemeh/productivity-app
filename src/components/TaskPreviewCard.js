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

    // اگر تایمر وجود نداره، ایجادش کن
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
                if (!task || !task.id) return null;

                const timer = timers[task.id] || { elapsed: 0, isRunning: false };
                const totalTime = (task.totalDuration || 0) + timer.elapsed;

                // Progress bar - نمایش زمان کل نسبت به یک مقدار ثابت (مثلاً 1 ساعت)
                const maxDuration = 3600; // 1 ساعت
                const progress = Math.min((totalTime / maxDuration) * 100, 100);

                return (
                    <div
                        key={task.id}
                        className="task-preview__card-task"
                        style={{ "--progress": `${progress}%` }}
                        onClick={() => setSelectedTask && setSelectedTask(task)}
                    >
                      <div className="circle"></div>
                      <span title={task.title || "Untitled"}>
                        {task.title || "Untitled"}
                        {totalTime > 0 && (
                            <small style={{ marginRight: '5px', fontSize: '0.75rem', color: '#666' }}>
                              ({formatTime(totalTime)})
                            </small>
                        )}
                      </span>
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
              }).filter(Boolean)
          )}
        </div>
      </div>
  );
}

export default TaskPreviewCard;