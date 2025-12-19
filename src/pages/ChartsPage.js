// pages/ChartsPage.js
import React, { useState, useEffect, useContext } from 'react';
import './ChartsPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import { LanguageContext } from '../context/LanguageContext';
import { tasksAPI } from '../api/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

function ChartsPage() {
    const { t } = useContext(LanguageContext);
    const [todayPerformance, setTodayPerformance] = useState(null);
    const [weekPerformance, setWeekPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();

        // هر 30 ثانیه یکبار refresh
        const interval = setInterval(() => {
            fetchAllData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            // دریافت داده امروز
            const todayResponse = await tasksAPI.getTodayPerformance();
            const normalizedTodayData = {
                completion_percentage: todayResponse.done_percent,
                tasks_completed_today: todayResponse.done_today_count,
                undone_percent: todayResponse.undone_percent
            };
            setTodayPerformance(normalizedTodayData);

            // دریافت داده هفتگی
            const weekResponse = await tasksAPI.getWeekPerformance();
            const processedWeekData = processWeekData(weekResponse);
            setWeekPerformance(processedWeekData);

            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('خطا در دریافت اطلاعات');
        } finally {
            setLoading(false);
        }
    };

    const processWeekData = (data) => {
        const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
        const today = new Date();
        const todayIndex = (today.getDay() + 1) % 7; // تبدیل به ایندکس فارسی (شنبه = 0)

        // تبدیل object به array و معکوس کردن (از 6 روز قبل تا امروز)
        const dataArray = [];
        for (let i = 6; i >= 0; i--) {
            const dayData = data[i.toString()];
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

    const getDonutStyle = (percentage) => {
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return {
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
        };
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
                    strokeWidth={isToday ? 2 : 0}
                />
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{data.day}</p>
                    <p style={{ margin: '5px 0', color: '#57CC99' }}>
                        انجام شده: {data.done}
                    </p>
                    <p style={{ margin: '5px 0', color: '#FF6B6B' }}>
                        انجام نشده: {data.undone}
                    </p>
                    <p style={{ margin: '5px 0' }}>
                        مجموع: {data.total}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="d-flex charts-page" dir="rtl">
            <SidebarMenu />
            <div className="main-content d-flex flex-column flex-grow-1">
                <div className="charts-header">
                    <h1 className="charts-title">{t('charts.title')}</h1>
                </div>

                <div className="charts-content">
                    {loading ? (
                        <div className="loading-message">در حال بارگذاری...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        <>
                            {/* کارت نمودار دونات */}
                            <div className="performance-card">
                                <div className="performance-card__content">
                                    <div className="performance-card__text">
                                        <h2 className="performance-card__title">
                                            {t('charts.todayProgress')}
                                        </h2>
                                        <p className="performance-card__description">
                                            {t('charts.todayProgressDescription', {
                                                completed: todayPerformance?.tasks_completed_today || 0,
                                            })}
                                        </p>
                                        <div className="stat-item">
                                            <span className="stat-label">
                                                {t('charts.tasksCompleted')} :
                                            </span>
                                            <span className="stat-value">
                                                {todayPerformance?.tasks_completed_today || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="performance-card__chart">
                                        <svg className="donut-chart" viewBox="0 0 160 160">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="none"
                                                stroke="#E0E0E0"
                                                strokeWidth="12"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                fill="none"
                                                stroke="#57CC99"
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                style={getDonutStyle(todayPerformance?.completion_percentage || 0)}
                                                transform="rotate(-90 80 80)"
                                            />
                                            <text
                                                x="80"
                                                y="75"
                                                textAnchor="middle"
                                                fontSize="32"
                                                fontWeight="bold"
                                                fill="#2C868B"
                                            >
                                                {todayPerformance?.completion_percentage || 0}%
                                            </text>
                                            <text
                                                x="80"
                                                y="95"
                                                textAnchor="middle"
                                                fontSize="12"
                                                fill="#7C7C7C"
                                            >
                                                {t('charts.completed')}
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* کارت نمودار میله‌ای هفتگی */}
                            <div className="performance-card weekly-chart">
                                <div className="performance-card__header">
                                    <h2 className="performance-card__title">
                                        نمودار پیشرفت هفتگی
                                    </h2>
                                    <p className="performance-card__description">
                                        عملکرد شما در 7 روز گذشته
                                    </p>
                                </div>

                                <div className="performance-card__bar-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={weekPerformance}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                                            <XAxis
                                                dataKey="day"
                                                tick={{ fill: '#7C7C7C', fontSize: 14 }}
                                                tickLine={{ stroke: '#E0E0E0' }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#7C7C7C', fontSize: 14 }}
                                                tickLine={{ stroke: '#E0E0E0' }}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend
                                                wrapperStyle={{ paddingTop: '20px' }}
                                                formatter={(value) => {
                                                    if (value === 'done') return 'انجام شده';
                                                    if (value === 'undone') return 'انجام نشده';
                                                    return value;
                                                }}
                                            />
                                            <Bar
                                                dataKey="done"
                                                stackId="a"
                                                fill="#57CC99"
                                                shape={<CustomBar />}
                                            />
                                            <Bar
                                                dataKey="undone"
                                                stackId="a"
                                                fill="#FF6B6B"
                                                shape={<CustomBar />}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChartsPage;