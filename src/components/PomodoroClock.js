import React, { useContext, useEffect } from "react";
import "./PomodoroClock.scss";
import { TaskContext } from "./TaskContext";

const PomodoroClock = ({ selectedTask }) => {
    const { timers, startTimer, stopTimer, resetTimerForTask, initialDuration } = useContext(TaskContext);

    // Derive currentTimer safely
    const currentTimer = selectedTask && timers[selectedTask.id]
        ? timers[selectedTask.id]
        : { remaining: initialDuration, isRunning: false };

    const time = currentTimer.remaining;
    const isActive = currentTimer.isRunning;

    // به‌روزرسانی تایمر هنگام تغییر initialDuration یا selectedTask
    useEffect(() => {
        if (selectedTask) {
            if (!timers[selectedTask.id]) {
                resetTimerForTask(selectedTask.id); // Initialize timer if it doesn't exist
            } else if (timers[selectedTask.id].remaining === 0 || timers[selectedTask.id].remaining > initialDuration) {
                // اگر تایمر صفر شده یا از initialDuration بیشتر است، آن را ریست کن
                resetTimerForTask(selectedTask.id);
            }
        }
    }, [selectedTask, initialDuration, resetTimerForTask, timers]);

    const toggleTimer = () => {
        if (selectedTask) {
            if (isActive) {
                stopTimer(selectedTask.id); // Pause the timer
            } else {
                startTimer(selectedTask.id); // Start or resume the timer
            }
        }
    };

    const resetTimer = () => {
        if (selectedTask) {
            resetTimerForTask(selectedTask.id); // Reset the timer to initial duration
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progressPercentage = initialDuration && time ? ((initialDuration - time) / initialDuration) * 100 : 0;

    return (
        <div className="pomodoro-clock">
            <div className="pomodoro-clock__white-bg">
                <div
                    className="pomodoro-clock__timer-circle"
                    style={{
                        background: `conic-gradient(#2C868B ${progressPercentage}%, #5ecea8 ${progressPercentage}% 100%)`,
                    }}
                >
                    <span className="pomodoro-clock__time">{formatTime(time)}</span>
                </div>
            </div>
            <div className="pomodoro-clock__controls">
                <button className="pomodoro-clock__play-pause" onClick={toggleTimer} disabled={!selectedTask}>
                    {isActive ? <img src="/assets/icons/pause.svg" alt="Pause" /> : <img src="/assets/icons/Polygon.svg" alt="Play" />}
                </button>
                <button className="pomodoro-clock__stop" onClick={resetTimer} disabled={!selectedTask}>
                    <img src="/assets/icons/stop.svg" alt="Stop" />
                </button>
            </div>
        </div>
    );
};

export default PomodoroClock;