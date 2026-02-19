import React, { useContext } from "react";
import { TaskContext } from "./TaskContext";
import "./MobileTimerBar.scss";

const MobileTimerBar = ({ selectedTask }) => {
    const { timers, startTimer, stopTimer, resetTimerForTask, tasks } = useContext(TaskContext);

    const currentTimer = selectedTask && timers[selectedTask.id]
        ? timers[selectedTask.id]
        : { elapsed: 0, isRunning: false };

    const time = currentTimer.elapsed;
    const isActive = currentTimer.isRunning;

    const currentTask = tasks.find(t => t.id === selectedTask?.id);
    const totalTime = (currentTask?.totalDuration || 0) + time;

    const toggleTimer = () => {
        if (!selectedTask) return;

        if (isActive) {
            stopTimer(selectedTask.id);
        } else {
            startTimer(selectedTask.id);
        }
    };

    const resetTimer = () => {
        if (!selectedTask) return;
        resetTimerForTask(selectedTask.id);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="mobile-timer-bar">
            <div className="mobile-timer-bar__content">
                <div className="mobile-timer-bar__info">
                    {selectedTask ? (
                        <>
                            <span className="mobile-timer-bar__task-name">{selectedTask.title}</span>
                            <span className="mobile-timer-bar__time">{formatTime(time)}</span>
                        </>
                    ) : (
                        <span className="mobile-timer-bar__placeholder">هیچ تسکی انتخاب نشده</span>
                    )}
                </div>
                <div className="mobile-timer-bar__controls">
                    <button
                        className="mobile-timer-bar__button mobile-timer-bar__button--play"
                        onClick={toggleTimer}
                        disabled={!selectedTask}
                    >
                        {isActive ? (
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                <rect x="4" y="3" width="3" height="10" rx="1" />
                                <rect x="9" y="3" width="3" height="10" rx="1" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5 3L13 8L5 13V3Z" />
                            </svg>
                        )}
                    </button>
                    <button
                        className="mobile-timer-bar__button mobile-timer-bar__button--reset"
                        onClick={resetTimer}
                        disabled={!selectedTask}
                    >
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="3" y="3" width="10" height="10" rx="1" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileTimerBar;