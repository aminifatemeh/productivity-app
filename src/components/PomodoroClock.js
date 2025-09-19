import React, { useContext, useEffect } from "react";
import "./PomodoroClock.scss";
import { TaskContext } from "../components/TaskContext";

const PomodoroClock = ({ selectedTask }) => {
    const { timers, startTimer, stopTimer, resetTimerForTask, initialDuration } = useContext(TaskContext);
    const totalTime = initialDuration; // Use initialDuration from context

    // Get current timer state for the selected task
    const currentTimer = selectedTask ? timers[selectedTask.id] || { remaining: initialDuration, isRunning: false } : null;
    const time = currentTimer ? currentTimer.remaining : initialDuration;
    const isActive = currentTimer ? currentTimer.isRunning : false;

    useEffect(() => {
        if (selectedTask) {
            // Start the timer if it's not running
            startTimer(selectedTask.id);
        }
        return () => {
            if (selectedTask) {
                // Pause the timer when component unmounts or task changes
                stopTimer(selectedTask.id);
            }
        };
    }, [selectedTask, startTimer, stopTimer]);

    const toggleTimer = () => {
        if (selectedTask) {
            if (isActive) {
                stopTimer(selectedTask.id);
            } else {
                startTimer(selectedTask.id);
            }
        }
    };

    const resetTimer = () => {
        if (selectedTask && resetTimerForTask) {
            resetTimerForTask(selectedTask.id);
        } else {
            console.warn("resetTimerForTask is not available or no task selected");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Calculate the conic-gradient percentage based on elapsed time
    const progressPercentage = initialDuration ? ((initialDuration - time) / initialDuration) * 100 : 0;

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
                    {isActive ? "⏸" : "▶"}
                </button>
                <button className="pomodoro-clock__stop" onClick={resetTimer} disabled={!selectedTask}>
                    ■
                </button>
            </div>
        </div>
    );
};

export default PomodoroClock;