// pages/ChartsPage.js
import React, { useState, useEffect, useContext } from 'react';
import './ChartsPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import { LanguageContext } from '../context/LanguageContext';
import { tasksAPI } from '../api/apiService';

function ChartsPage() {
    const { t } = useContext(LanguageContext);
    const [todayPerformance, setTodayPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTodayPerformance();
    }, []);

    const fetchTodayPerformance = async () => {
        try {
            setLoading(true);
            const response = await tasksAPI.getTodayPerformance();
            setTodayPerformance(response);
            setError(null);
        } catch (err) {
            console.error('Error fetching today performance:', err);
            setError('خطا در دریافت اطلاعات');
        } finally {
            setLoading(false);
        }
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
                                </div>

                                <div className="performance-card__chart">
                                    <svg className="donut-chart" viewBox="0 0 160 160">
                                        {/* Background circle */}
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke="#E0E0E0"
                                            strokeWidth="12"
                                        />
                                        {/* Progress circle */}
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
                                        {/* Center text */}
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

                            <div className="performance-card__stats">
                                <div className="stat-item">
                                    <span className="stat-label">{t('charts.tasksCompleted')}</span>
                                    <span className="stat-value">
                                        {todayPerformance?.tasks_completed_today || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChartsPage;