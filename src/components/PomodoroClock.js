import React, { useState, useEffect } from "react";
import "./PomodoroClock.scss";

const PomodoroClock = ({ selectedTask }) => {
    const [time, setTime] = useState(20 * 60); // 20 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const totalTime = 20 * 60; // Total time for progress calculation

    useEffect(() => {
        // Start or reset timer when a new task is selected
        if (selectedTask) {
            setTime(20 * 60); // Reset to 20 minutes
            setIsActive(true); // Start timer automatically
        } else {
            setIsActive(false); // Stop timer if no task is selected
            setTime(20 * 60); // Reset timer
        }
    }, [selectedTask]);

    useEffect(() => {
        let interval = null;
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTime(20 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate the conic-gradient percentage based on remaining time
    const progressPercentage = (time / totalTime) * 100;

    return (
        <div className="pomodoro-clock">
            <div className="pomodoro-clock__white-bg">
                <div
                    className="pomodoro-clock__timer-circle"
                    style={{
                        background: `conic-gradient(#2C868B ${progressPercentage}%, #5ecea8 ${progressPercentage}% 100%)`
                    }}
                >
                    <span className="pomodoro-clock__time">{formatTime(time)}</span>
                </div>
            </div>
            <div className="pomodoro-clock__controls">
                <button className="pomodoro-clock__play-pause" onClick={toggleTimer}>
                    {isActive ? '⏸' : '▶'}
                </button>
                <button className="pomodoro-clock__stop" onClick={resetTimer}>■</button>
            </div>
        </div>
    );
};

export default PomodoroClock;