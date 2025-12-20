import React, { useContext, useEffect } from "react";
import "./PomodoroClock.scss";
import { TaskContext } from "./TaskContext";

const PomodoroClock = ({ selectedTask }) => {
    const { timers, startTimer, stopTimer, resetTimerForTask, setTimers, tasks } = useContext(TaskContext);

    // Initialize timer for selected task if it doesn't exist
    useEffect(() => {
        if (selectedTask && !timers[selectedTask.id]) {
            setTimers(prev => ({
                ...prev,
                [selectedTask.id]: { elapsed: 0, isRunning: false }
            }));
        }
    }, [selectedTask, timers, setTimers]);

    const currentTimer = selectedTask && timers[selectedTask.id]
        ? timers[selectedTask.id]
        : { elapsed: 0, isRunning: false };

    const time = currentTimer.elapsed;
    const isActive = currentTimer.isRunning;

    // محاسبه زمان کل (زمان قبلی + زمان جاری)
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

    // Progress برای نمایش - چون کرنومتره، فقط وقتی active هست progress داره
    const progressPercentage = isActive ? 75 : 0; // یا می‌تونی براساس زمان یه فرمول دیگه بنویسی

    return (
        <div className="pomodoro-clock">
            <div className="pomodoro-clock__white-bg">
                <div
                    className="pomodoro-clock__timer-circle"
                    style={{
                        background: isActive
                            ? `conic-gradient(#2C868B ${progressPercentage}%, #5ecea8 ${progressPercentage}% 100%)`
                            : '#5ecea8',
                    }}
                >
                    <div className="pomodoro-clock__time-container">
                        <span className="pomodoro-clock__time">
                            {formatTime(time)}
                        </span>
                        {totalTime > 0 && (
                            <span className="pomodoro-clock__total-time">
                                کل: {formatTime(totalTime)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="pomodoro-clock__controls">
                <button
                    className="pomodoro-clock__play-pause"
                    onClick={toggleTimer}
                    disabled={!selectedTask}
                >
                    {isActive ? (
                        <img src="/assets/icons/pause.svg" alt="Pause" />
                    ) : (
                        <img src="/assets/icons/Polygon.svg" alt="Play" />
                    )}
                </button>
                <button
                    className="pomodoro-clock__stop"
                    onClick={resetTimer}
                    disabled={!selectedTask}
                >
                    <img src="/assets/icons/stop.svg" alt="Stop" />
                </button>
            </div>
        </div>
    );
};

export default PomodoroClock;