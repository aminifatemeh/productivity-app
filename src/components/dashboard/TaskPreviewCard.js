import React, { useContext, useEffect, useState } from "react";
import "./TaskPreviewCard.scss";
import { TaskContext } from "../../api/TaskContext";
import { LanguageContext } from "../../context/LanguageContext";
import { tasksAPI } from "../../api/apiService";

const KhakKhordeIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="1.2" fill="white"/>
      <line x1="12" y1="12" x2="12" y2="3" stroke="white" strokeWidth="1.2"/>
      <line x1="12" y1="12" x2="19.5" y2="7.5" stroke="white" strokeWidth="1.2"/>
      <line x1="12" y1="12" x2="19.5" y2="16.5" stroke="white" strokeWidth="1.2"/>
      <line x1="12" y1="12" x2="12" y2="21" stroke="white" strokeWidth="1.2"/>
      <line x1="12" y1="12" x2="4.5" y2="16.5" stroke="white" strokeWidth="1.2"/>
      <line x1="12" y1="12" x2="4.5" y2="7.5" stroke="white" strokeWidth="1.2"/>
      <path d="M12 6 Q15.5 9 15.5 12 Q15.5 15 12 18 Q8.5 15 8.5 12 Q8.5 9 12 6Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M12 3.5 Q18 7.5 18 12 Q18 16.5 12 20.5 Q6 16.5 6 12 Q6 7.5 12 3.5Z" stroke="white" strokeWidth="1" fill="none"/>
    </svg>
);

const NobateshMisheIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="10" width="20" height="2.5" rx="1.2" stroke="white" strokeWidth="1.5"/>
      <line x1="6" y1="12.5" x2="5" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="12.5" x2="19" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5.3" y1="17" x2="18.7" y2="17" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
);

const RumizIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="3" x2="17" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="21" x2="17" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 3 C8 3 8 8 12 12 C16 16 16 21 16 21" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M16 3 C16 3 16 8 12 12 C8 16 8 21 8 21" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M9.5 19.5 Q12 17.5 14.5 19.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>
);

const cardConfigs = {
  active: {
    color: "#38A3A5",
    icon: <RumizIcon />,
    labelKey: "taskPreviewCard.active",
    gradient: "linear-gradient(135deg, #38A3A5 0%, #4AB8BB 100%)",
    endpoint: "rumiz"
  },
  upNext: {
    color: "#57CC99",
    icon: <NobateshMisheIcon />,
    labelKey: "taskPreviewCard.upNext",
    gradient: "linear-gradient(135deg, #57CC99 0%, #6DE2AF 100%)",
    endpoint: "nobatesh_mishe"
  },
  archived: {
    color: "#80ED99",
    icon: <KhakKhordeIcon />,
    labelKey: "taskPreviewCard.archived",
    gradient: "linear-gradient(135deg, #80ED99 0%, #96F5AF 100%)",
    endpoint: "khak_khorde"
  },
};


function TaskPreviewCard({ cardName, setSelectedTask, selectedTask }) {
  const { timers, startTimer, stopTimer, setTimers } = useContext(TaskContext);
  const { t } = useContext(LanguageContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = cardConfigs[cardName] || cardConfigs.active;

  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    const parts = durationStr.split(':');
    const hours = parseInt(parts[0] || 0);
    const mins = parseInt(parts[1] || 0);
    const secs = parseInt(parts[2] || 0);
    return hours * 3600 + mins * 60 + secs;
  };

  const normalizeTask = (task) => {
    return {
      id: task.id.toString(),
      title: task.title || 'بدون عنوان',
      description: task.description || '',
      flag_tuNobat: task.flag_tuNobat || false,
      isDone: !!task.done_date,
      done_date: task.done_date || null,
      subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
      tags: Array.isArray(task.categories) ? task.categories : [],
      deadline_date: task.deadline_date || null,
      deadline_time: task.deadline_time || '',
      totalDuration: task.duration ? parseDuration(task.duration) : 0,
      duration: task.duration || '00:00:00',
    };
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let data;

      switch (config.endpoint) {
        case 'khak_khorde':
          data = await tasksAPI.getKhakKhordeTasks();
          break;
        case 'rumiz':
          data = await tasksAPI.getRumizTasks();
          break;
        case 'nobatesh_mishe':
          data = await tasksAPI.getNobateshMisheTasks();
          break;
        default:
          data = [];
      }

      let tasksArray = [];
      if (Array.isArray(data)) {
        tasksArray = data;
      } else if (data && typeof data === 'object') {
        if (config.endpoint === 'rumiz') {
          tasksArray = [
            ...(data.completed_tasks || []),
            ...(data.not_completed_tasks || [])
          ];
        } else {
          tasksArray = data.tasks || data.not_completed_tasks || data.completed_tasks || [];
        }
      }

      const normalizedTasks = Array.isArray(tasksArray)
          ? tasksArray.map(task => normalizeTask(task))
          : [];

      setTasks(normalizedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [cardName]);

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

    if (setSelectedTask) {
      setSelectedTask(task);
    }
  };

  const handlePlayPause = (e, task) => {
    e.stopPropagation();

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
  };

  if (loading) {
    return (
        <div className="task-preview__card" style={{ background: config.gradient }}>
          <div className="task-preview__card-header">
            <div className="header-content">
              <div className="header-icon">{config.icon}</div>
              <span className="header-title">{t(config.labelKey)}</span>
            </div>
            <div className="task-count-badge">...</div>
          </div>
          <div className="task-preview__card-tasks">
            <div className="empty-state">
              <span>در حال بارگذاری...</span>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="task-preview__card" style={{ background: config.gradient }}>
        <div className="task-preview__card-header">
          <div className="header-content">
            <div className="header-icon">{config.icon}</div>
            <span className="header-title">{t(config.labelKey)}</span>
          </div>
          <div className="task-count-badge">{tasks.length}</div>
        </div>

        <div className="task-preview__card-tasks">
          {tasks.length === 0 ? (
              <div className="empty-state">
                <span>{t("taskPreviewCard.noTasks")}</span>
              </div>
          ) : (
              tasks.map((task) => {
                if (!task || !task.id) return null;

                const timer = timers[task.id] || { elapsed: 0, isRunning: false };
                const totalTime = (task.totalDuration || 0) + timer.elapsed;
                const maxDuration = 3600;
                const progress = Math.min((totalTime / maxDuration) * 100, 100);
                const isSelected = selectedTask && selectedTask.id === task.id;

                return (
                    <div
                        key={task.id}
                        className={`task-preview__card-task ${timer.isRunning ? 'is-running' : ''} ${isSelected ? 'is-selected' : ''}`}
                        style={{ "--progress": `${progress}%` }}
                        onClick={() => handleTaskClick(task)}
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
                          onClick={(e) => handlePlayPause(e, task)}
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
