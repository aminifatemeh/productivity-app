import React, { useContext, useEffect } from "react";
import "./PomodoroClock.scss";
import { TaskContext } from "../../api/TaskContext";
import { PomodoroPauseIcon, PomodoroPlayIcon, PomodoroStopIcon } from "../Icons"; // adjust path if needed


const PomodoroClock = ({ selectedTask }) => {
    const { timers, startTimer, stopTimer, resetTimerForTask, setTimers, tasks } = useContext(TaskContext);

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

    const progressPercentage = isActive ? Math.min((time % 1500) / 1500 * 100, 100) : 0;

    return (
        <div className="pomodoro-clock">
            <div className="pomodoro-clock__outer-ring">
                <div className="pomodoro-clock__middle-ring">
                    <div
                        className="pomodoro-clock__timer-circle"
                        style={{
                            background: isActive
                                ? `conic-gradient(#2C868B ${progressPercentage}%, #5ecea8 ${progressPercentage}% 100%)`
                                : '#5ecea8',
                        }}
                    >
                        <div className="pomodoro-clock__inner-circle">
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
                </div>
            </div>
            <div className="pomodoro-clock__controls">
                <button
                    className="pomodoro-clock__button pomodoro-clock__play-pause"
                    onClick={toggleTimer}
                    disabled={!selectedTask}
                >
                    {isActive ? <PomodoroPauseIcon /> : <PomodoroPlayIcon />}

                </button>
                <button
                    className="pomodoro-clock__button pomodoro-clock__stop"
                    onClick={resetTimer}
                    disabled={!selectedTask}
                >
                    <PomodoroStopIcon />
                </button>
            </div>
        </div>
    );
};

export default PomodoroClock;
