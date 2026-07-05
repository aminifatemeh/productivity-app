import React, { useContext } from "react";
import "./TaskPreviewCard.scss";
import { TaskContext } from "../../api/TaskContext";
import { LanguageContext } from "../../context/LanguageContext";


const KhakKhordeIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="1.2" fill="white" />
    <line x1="12" y1="12" x2="12" y2="3" stroke="white" strokeWidth="1.2" />
    <line x1="12" y1="12" x2="19.5" y2="7.5" stroke="white" strokeWidth="1.2" />
    <line
      x1="12"
      y1="12"
      x2="19.5"
      y2="16.5"
      stroke="white"
      strokeWidth="1.2"
    />
    <line x1="12" y1="12" x2="12" y2="21" stroke="white" strokeWidth="1.2" />
    <line x1="12" y1="12" x2="4.5" y2="16.5" stroke="white" strokeWidth="1.2" />
    <line x1="12" y1="12" x2="4.5" y2="7.5" stroke="white" strokeWidth="1.2" />
    <path
      d="M12 6 Q15.5 9 15.5 12 Q15.5 15 12 18 Q8.5 15 8.5 12 Q8.5 9 12 6Z"
      stroke="white"
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M12 3.5 Q18 7.5 18 12 Q18 16.5 12 20.5 Q6 16.5 6 12 Q6 7.5 12 3.5Z"
      stroke="white"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const NobateshMisheIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="10"
      width="20"
      height="2.5"
      rx="1.2"
      stroke="white"
      strokeWidth="1.5"
    />
    <line
      x1="6"
      y1="12.5"
      x2="5"
      y2="20"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="18"
      y1="12.5"
      x2="19"
      y2="20"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="5.3"
      y1="17"
      x2="18.7"
      y2="17"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const RumizIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <line
      x1="7"
      y1="3"
      x2="17"
      y2="3"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="21"
      x2="17"
      y2="21"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 3 C8 3 8 8 12 12 C16 16 16 21 16 21"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M16 3 C16 3 16 8 12 12 C8 16 8 21 8 21"
      stroke="white"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M9.5 19.5 Q12 17.5 14.5 19.5"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const cardConfigs = {
  active: {
    color: "#38A3A5",
    icon: <RumizIcon />,
    labelKey: "taskPreviewCard.active",
    gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
    endpoint: "nobatesh_mishe",
  },
  upNext: {
    color: "#57CC99",
    icon: <NobateshMisheIcon />,
    labelKey: "taskPreviewCard.upNext",
    gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
    endpoint: "rumiz",
  },
  archived: {
    color: "#80ED99",
    icon: <KhakKhordeIcon />,
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
        <div className="task-count-badge">{loading ? "..." : tasks.length}</div>
      </div>

      <div className="task-preview__card-tasks">
        {loading ? (
          <div className="empty-state">
            <span>در حال بارگذاری...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span>{t("taskPreviewCard.noTasks")}</span>
          </div>
        ) : (
          tasks.map((task) => {
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
                  {timer.isRunning ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <rect x="4" y="3" width="3" height="10" rx="1" />
                      <rect x="9" y="3" width="3" height="10" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M5 3L13 8L5 13V3Z" />
                    </svg>
                  )}
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
