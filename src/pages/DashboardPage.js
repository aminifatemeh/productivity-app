import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TaskPreviewCard from "../components/TaskPreviewCard";
import UtilitySidebar from "../components/UtilitySidebar";
import SidebarMenu from "../components/SidebarMenu";
import Calendar from "../components/Calendar";
import { TaskContext } from "../components/TaskContext";
import { LanguageContext } from "../context/LanguageContext";
import { tasksAPI } from "../api/apiService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./DashboardPage.scss";

function DashboardPage() {
    const { timers } = useContext(TaskContext);
    const { t } = useContext(LanguageContext);
    const location = useLocation();
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timerDuration, setTimerDuration] = useState(
        location.state?.timerDuration || localStorage.getItem("timerDuration") || "5"
    );
    const [weekPerformance, setWeekPerformance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedDuration = localStorage.getItem("timerDuration");
            if (storedDuration && storedDuration !== timerDuration) {
                setTimerDuration(storedDuration);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [timerDuration]);

    useEffect(() => {
        if (selectedTask && timerDuration) {
            const timer = timers[selectedTask.id];
            if (!timer || !timer.isRunning) {
                // اینجا می‌توانید timerDuration را به TaskContext یا کامپوننت تایمر منتقل کنید
            }
        }
    }, [selectedTask, timers, timerDuration]);

    useEffect(() => {
        fetchWeekPerformance();
    }, []);

    const fetchWeekPerformance = async () => {
        try {
            setLoading(true);
            const weekResponse = await tasksAPI.getWeekPerformance();
            const processedWeekData = processWeekData(weekResponse);
            setWeekPerformance(processedWeekData);
        } catch (err) {
            console.error('Error fetching week performance:', err);
        } finally {
            setLoading(false);
        }
    };

    const processWeekData = (data) => {
        const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
        const today = new Date();
        const todayIndex = (today.getDay() + 1) % 7;

        const dataArray = [];
        for (let i = 6; i >= 0; i--) {
            const dayData = data[i.toString()] || { done: 0, undone: 0 };
            const dayNameIndex = (todayIndex - i + 7) % 7;

            dataArray.push({
                day: persianDays[dayNameIndex],
                done: dayData.done,
                undone: dayData.undone,
                total: dayData.done + dayData.undone,
                isToday: i === 0
            });
        }

        return dataArray;
    };

    const CustomBar = (props) => {
        const { fill, x, y, width, height, payload } = props;
        const isToday = payload.isToday;

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    stroke={isToday ? '#2C868B' : 'none'}
                    strokeWidth={isToday ? 3 : 0}
                    rx={4}
                    ry={4}
                />
            </g>
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '12px 16px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#2C868B', marginBottom: '8px' }}>
                        {data.day}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#57CC99', borderRadius: '2px' }}></div>
                        <span style={{ color: '#333', fontSize: '14px' }}>انجام شده: <strong>{data.done}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ width: '12px', height: '12px', backgroundColor: '#FF6B6B', borderRadius: '2px' }}></div>
                        <span style={{ color: '#333', fontSize: '14px' }}>انجام نشده: <strong>{data.undone}</strong></span>
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #E0E0E0' }}>
                        <span style={{ color: '#666', fontSize: '13px' }}>مجموع: <strong>{data.total}</strong></span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-page d-flex">
            <UtilitySidebar selectedTask={selectedTask} selectedDate={selectedDate} />
            <main className="main-content d-flex flex-column align-items-center w-100">
                <div className="task-cards-container">
                    <TaskPreviewCard
                        cardName="archived"
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration}
                    />
                    <TaskPreviewCard
                        cardName="upNext"
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration}
                    />
                    <TaskPreviewCard
                        cardName="active"
                        setSelectedTask={setSelectedTask}
                        timerDuration={timerDuration}
                    />
                </div>

                <h2 className="section-title">{t("dashboard.chartCalendar")}</h2>

                <div className="bottom-section">
                    <div className="chart-wrapper">
                        <div className="chart-card">
                            <h3 className="chart-title">نمودار پیشرفت هفتگی</h3>
                            {loading ? (
                                <div className="loading-message">
                                    <div style={{
                                        display: 'inline-block',
                                        width: '40px',
                                        height: '40px',
                                        border: '4px solid #E0E0E0',
                                        borderTop: '4px solid #57CC99',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    <p style={{ marginTop: '15px' }}>در حال بارگذاری...</p>
                                </div>
                            ) : weekPerformance ? (
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart
                                        data={weekPerformance}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="doneGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#57CC99" stopOpacity={0.9}/>
                                                <stop offset="100%" stopColor="#57CC99" stopOpacity={0.7}/>
                                            </linearGradient>
                                            <linearGradient id="undoneGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.9}/>
                                                <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.7}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E8EBE4" vertical={false} />
                                        <XAxis
                                            dataKey="day"
                                            tick={{ fill: '#7C7C7C', fontSize: 13, fontWeight: 500 }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#E8EBE4' }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#7C7C7C', fontSize: 13 }}
                                            tickLine={false}
                                            axisLine={{ stroke: '#E8EBE4' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(44, 134, 139, 0.05)' }} />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '20px' }}
                                            iconType="circle"
                                            formatter={(value) => {
                                                if (value === 'done') return 'انجام شده';
                                                if (value === 'undone') return 'انجام نشده';
                                                return value;
                                            }}
                                        />
                                        <Bar
                                            dataKey="done"
                                            stackId="a"
                                            fill="url(#doneGradient)"
                                            shape={<CustomBar />}
                                            radius={[8, 8, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="undone"
                                            stackId="a"
                                            fill="url(#undoneGradient)"
                                            shape={<CustomBar />}
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="error-message">خطا در بارگذاری نمودار</div>
                            )}
                        </div>
                    </div>

                    <div className="calendar-wrapper">
                        <div className="calendar-container-wrapper">
                            <Calendar />
                        </div>
                    </div>
                </div>
            </main>
            <SidebarMenu />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default DashboardPage;