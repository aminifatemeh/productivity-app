import React, { useContext } from "react";
import "./TaskPreviewCard.scss";
import { TaskContext } from "../../api/TaskContext";
import { LanguageContext } from "../../context/LanguageContext";
import { KhakKhordeIcon, NobateshMisheIcon, RumizIcon, PlayIcon, PauseIcon } from "../Icons"; // Update path if needed

const cardConfigs = {
    active: {
        color: "#38A3A5",
        icon: <NobateshMisheIcon size={36} color="white" />,
        labelKey: "taskPreviewCard.active",
        gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
        endpoint: "nobatesh_mishe",
    },
    upNext: {
        color: "#57CC99",
        icon: <RumizIcon size={36} color="white" />,
        labelKey: "taskPreviewCard.upNext",
        gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
        endpoint: "rumiz",
    },
    archived: {
        color: "#80ED99",
        icon: <KhakKhordeIcon size={36} color="white" />,
        labelKey: "taskPreviewCard.archived",
        gradient: "linear-gradient(135deg, #80ED99 0%, #96F5AF 100%)",
        endpoint: "khak_khorde",
    },
};


function TaskPreviewCard({ cardName, setSelectedTask, selectedTask }) {
    const {
        timers,
        startTimer,
        stopTimer,
        setTimers,
        tasksByCategory,
        loadingByCategory,
    } = useContext(TaskContext);

    const { t } = useContext(LanguageContext);
    const config = cardConfigs[cardName] || cardConfigs.active;
    const categoryKey = config.endpoint;

    const tasks = tasksByCategory[categoryKey] || [];
    const loading = loadingByCategory[categoryKey];
    const visibleTasks = tasks.filter(task => !task?.isDone);




    const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleTaskClick = (task) => {
    if (!task?.id) return;
    if (!timers[task.id])
      setTimers((prev) => ({
        ...prev,
        [task.id]: { elapsed: 0, isRunning: false },
      }));
    setSelectedTask?.(task);
  };

  const handlePlayPause = async (e, task) => {
    e.stopPropagation();
    if (!task?.id) return;

    setSelectedTask?.(task);

    if (!timers[task.id]) {
      setTimers((prev) => ({
        ...prev,
        [task.id]: { elapsed: 0, isRunning: false },
      }));
    }

    const timer = timers[task.id] || { elapsed: 0, isRunning: false };
      if (timer.isRunning) {
          const result = await stopTimer(task.id);

          if (result?.success) {
              setSelectedTask?.({
                  ...task,
                  totalDuration: result.totalDuration,
                  duration: result.duration,
              });
          }
      } else {
          startTimer(task.id);
      }

  };

  return (
    <div className="task-preview__card" style={{ background: config.gradient }}>
      <div className="task-preview__card-header">
        <div className="header-content">
          <div className="header-icon">{config.icon}</div>
          <span className="header-title">{t(config.labelKey)}</span>
        </div>
        <div className="task-count-badge">{loading ? "..." : visibleTasks.length}
        </div>
      </div>

      <div className="task-preview__card-tasks">
        {loading ? (
          <div className="empty-state">
            <span>در حال بارگذاری...</span>
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-state">
            <span>{t("taskPreviewCard.noTasks")}</span>
          </div>
        ) : (
            visibleTasks.map((task) => {
            if (!task?.id) return null;
            const timer = timers[task.id] || { elapsed: 0, isRunning: false };
            const totalTime = (task.totalDuration || 0) + timer.elapsed;
            const progress = Math.min((totalTime / 3600) * 100, 100);
            const isSelected = selectedTask?.id === task.id;

            return (
              <div
                key={task.id}
                className={`task-preview__card-task ${
                  timer.isRunning ? "is-running" : ""
                } ${isSelected ? "is-selected" : ""}`}
                style={{ "--progress": `${progress}%` }}
                onClick={() => handleTaskClick(task)}
              >
                <div className="task-content">
                  <div className="task-indicator"></div>
                  <div className="task-info">
                    <span className="task-title" title={task.title}>
                      {task.title}
                    </span>
                    {totalTime > 0 && (
                      <span className="task-time">{formatTime(totalTime)}</span>
                    )}
                  </div>
                </div>
                <button
                  className={`task-action-btn ${
                    timer.isRunning ? "is-active" : ""
                  }`}
                  onClick={(e) => handlePlayPause(e, task)}
                  aria-label={timer.isRunning ? "Pause" : "Play"}
                >
                    {timer.isRunning ? <PauseIcon /> : <PlayIcon />}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TaskPreviewCard;
