import React, { useContext, useEffect, useState } from "react";
import "./PomodoroClock.scss";
import { TaskContext } from "./TaskContext";

const PomodoroClock = ({ selectedTask }) => {
    const { timers, startTimer, stopTimer, resetTimerForTask, initialDuration, setTimers } = useContext(TaskContext);
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [editMinutes, setEditMinutes] = useState(Math.floor(initialDuration / 60));

    // Initialize timer for selected task if it doesn't exist
    useEffect(() => {
        if (selectedTask && !timers[selectedTask.id]) {
            setTimers(prev => ({
                ...prev,
                [selectedTask.id]: { remaining: initialDuration, isRunning: false }
            }));
        }
    }, [selectedTask, timers, initialDuration, setTimers]);

    const currentTimer = selectedTask && timers[selectedTask.id]
        ? timers[selectedTask.id]
        : { remaining: initialDuration, isRunning: false };

    const time = currentTimer.remaining;
    const isActive = currentTimer.isRunning;

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

    const handleTimeClick = () => {
        if (!isActive && selectedTask) {
            setIsEditingTime(true);
            setEditMinutes(Math.floor(time / 60));
        }
    };

    const handleTimeChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setEditMinutes(Math.max(1, Math.min(99, value))); // بین 1 تا 99 دقیقه
    };

    const handleTimeSubmit = () => {
        if (selectedTask && editMinutes > 0) {
            const newDuration = editMinutes * 60;
            setTimers(prev => ({
                ...prev,
                [selectedTask.id]: { remaining: newDuration, isRunning: false }
            }));
        }
        setIsEditingTime(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTimeSubmit();
        } else if (e.key === 'Escape') {
            setIsEditingTime(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPercentage = initialDuration && time
        ? ((initialDuration - time) / initialDuration) * 100
        : 0;

    return (
        <div className="pomodoro-clock">
            <div className="pomodoro-clock__white-bg">
                <div
                    className="pomodoro-clock__timer-circle"
                    style={{
                        background: `conic-gradient(#2C868B ${progressPercentage}%, #5ecea8 ${progressPercentage}% 100%)`,
                    }}
                >
                    {isEditingTime ? (
                        <input
                            type="number"
                            className="pomodoro-clock__time-input"
                            value={editMinutes}
                            onChange={handleTimeChange}
                            onBlur={handleTimeSubmit}
                            onKeyDown={handleKeyPress}
                            autoFocus
                            min="1"
                            max="99"
                        />
                    ) : (
                        <span
                            className="pomodoro-clock__time"
                            onClick={handleTimeClick}
                            style={{ cursor: !isActive && selectedTask ? 'pointer' : 'default' }}
                            title={!isActive && selectedTask ? 'کلیک برای تغییر زمان' : ''}
                        >
                            {formatTime(time)}
                        </span>
                    )}
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