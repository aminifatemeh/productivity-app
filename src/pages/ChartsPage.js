// pages/ChartsPage.js
import React, { useState, useEffect, useContext } from 'react';
import './ChartsPage.scss';
import SidebarMenu from '../components/SidebarMenu';
import { LanguageContext } from '../context/LanguageContext';
import { tasksAPI } from '../api/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment-jalaali';

function ChartsPage() {
    const { t } = useContext(LanguageContext);
    const [todayPerformance, setTodayPerformance] = useState(null);
    const [weekPerformance, setWeekPerformance] = useState(null);
    const [monthPerformance, setMonthPerformance] = useState(null);
    const [overallPerformance, setOverallPerformance] = useState(null);
    const [averageDelay, setAverageDelay] = useState(null);
    const [todayFocus, setTodayFocus] = useState(null);
    const [weekFocus, setWeekFocus] = useState(null);
    const [monthFocus, setMonthFocus] = useState(null);
    const [currentMonth, setCurrentMonth] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
        moment.loadPersian({ usePersianDigits: false });
        const persianMonth = moment().format('jMMMM');
        setCurrentMonth(persianMonth);
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const todayResponse = await tasksAPI.getTodayPerformance();
            const normalizedTodayData = {
                completion_percentage: todayResponse.done_percent,
                tasks_completed_today: todayResponse.done_today_count,
                undone_percent: todayResponse.undone_percent
            };
            setTodayPerformance(normalizedTodayData);

            const weekResponse = await tasksAPI.getWeekPerformance();
            const processedWeekData = processWeekData(weekResponse);
            setWeekPerformance(processedWeekData);

            const monthResponse = await tasksAPI.getMonthPerformance();
            const processedMonthData = processMonthData(monthResponse);
            setMonthPerformance(processedMonthData);

            const performanceResponse = await tasksAPI.getPerformance();
            setOverallPerformance(performanceResponse);

            const delayResponse = await tasksAPI.getAverageDelay();
            setAverageDelay(delayResponse);

            const todayFocusResponse = await tasksAPI.getTodayFocus();
            setTodayFocus(todayFocusResponse);

            const weekFocusResponse = await tasksAPI.getWeekFocus();
            setWeekFocus(weekFocusResponse);

            const monthFocusResponse = await tasksAPI.getMonthFocus();
            setMonthFocus(monthFocusResponse);

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

    const processMonthData = (data) => {
        moment.loadPersian({ usePersianDigits: false });
        const dataArray = [];
        for (let i = 29; i >= 0; i--) {
            const dayData = data[i.toString()] || { done: 0, undone: 0 };
            const targetDate = moment().subtract(i, 'days');
            const dayNumber = parseInt(targetDate.format('jD'));
            dataArray.push({
                day: dayNumber,
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

    const getMultiColorDonutStyle = (percentages) => {
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        let currentOffset = 0;
        const segments = percentages.map(percentage => {
            const segmentLength = (percentage / 100) * circumference;
            const segment = {
                strokeDasharray: `${segmentLength} ${circumference}`,
                strokeDashoffset: -currentOffset,
            };
            currentOffset += segmentLength;
            return segment;
        });
        return segments;
    };

    const convertDaysToTime = (days) => {
        if (!days || days === 0) {
            return { days: 0, hours: 0, minutes: 0 };
        }
        const totalDays = Math.floor(days);
        const remainingHours = (days - totalDays) * 24;
        const hours = Math.floor(remainingHours);
        const minutes = Math.floor((remainingHours - hours) * 60);
        return { days: totalDays, hours, minutes };
    };

    const formatDelayTime = (days) => {
        const { days: d, hours: h, minutes: m } = convertDaysToTime(days);
        return `${d} روز ${h} ساعت ${m} دقیقه`;
    };

    const formatDuration = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        if (hours > 0) {
            return `${hours} ساعت ${minutes} دقیقه`;
        }
        return `${minutes} دقیقه`;
    };

    const getFocusPercentage = (duration, maxHours = 8) => {
        const maxSeconds = maxHours * 3600;
        const percentage = Math.min((duration / maxSeconds) * 100, 100);
        return Math.round(percentage);
    };

    const CustomBar = (props) => {
        const { fill, x, y, width, height, payload } = props;
        const isToday = payload.isToday;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} fill={fill}
                      stroke={isToday ? '#2C868B' : 'none'} strokeWidth={isToday ? 2 : 0} />
            </g>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                        {typeof data.day === 'number' ? `روز ${data.day}` : data.day}
                    </p>
                    <p style={{ margin: '5px 0', color: '#57CC99' }}>انجام شده: {data.done}</p>
                    <p style={{ margin: '5px 0', color: '#FF6B6B' }}>انجام نشده: {data.undone}</p>
                    <p style={{ margin: '5px 0' }}>مجموع: {data.total}</p>
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
                            <div className="performance-card">
                                <div className="performance-card__content">
                                    <div className="performance-card__text">
                                        <h2 className="performance-card__title">{t('charts.todayProgress')}</h2>
                                        <p className="performance-card__description">
                                            {t('charts.todayProgressDescription', { completed: todayPerformance?.tasks_completed_today || 0 })}
                                        </p>
                                        <div className="stat-item">
                                            <span className="stat-label">{t('charts.tasksCompleted')} :</span>
                                            <span className="stat-value">{todayPerformance?.tasks_completed_today || 0}</span>
                                        </div>
                                    </div>
                                    <div className="performance-card__chart">
                                        <svg className="donut-chart" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#E0E0E0" strokeWidth="12" />
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#57CC99" strokeWidth="12"
                                                    strokeLinecap="round" style={getDonutStyle(todayPerformance?.completion_percentage || 0)}
                                                    transform="rotate(-90 80 80)" />
                                            <text x="80" y="75" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#2C868B">
                                                {todayPerformance?.completion_percentage || 0}%
                                            </text>
                                            <text x="80" y="95" textAnchor="middle" fontSize="12" fill="#7C7C7C">
                                                {t('charts.completed')}
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="performance-card">
                                <div className="performance-card__content">
                                    <div className="performance-card__text">
                                        <h2 className="performance-card__title">نمودار عملکرد کلی</h2>
                                        <p className="performance-card__description">وضعیت کلی انجام تسک‌های شما</p>
                                        <div className="performance-stats">
                                            <div className="stat-item-inline">
                                                <div className="stat-color-box" style={{ backgroundColor: '#57CC99' }}></div>
                                                <span className="stat-label">به موقع:</span>
                                                <span className="stat-value">{overallPerformance?.ontime_percent || 0}%</span>
                                            </div>
                                            <div className="stat-item-inline">
                                                <div className="stat-color-box" style={{ backgroundColor: '#FFA726' }}></div>
                                                <span className="stat-label">با تاخیر:</span>
                                                <span className="stat-value">{overallPerformance?.late_percent || 0}%</span>
                                            </div>
                                            <div className="stat-item-inline">
                                                <div className="stat-color-box" style={{ backgroundColor: '#FF6B6B' }}></div>
                                                <span className="stat-label">تمام نشده:</span>
                                                <span className="stat-value">{overallPerformance?.undone_percent || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="performance-card__chart">
                                        <svg className="donut-chart" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#E0E0E0" strokeWidth="12" />
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#57CC99" strokeWidth="12"
                                                    strokeLinecap="round" style={getMultiColorDonutStyle([
                                                overallPerformance?.ontime_percent || 0,
                                                overallPerformance?.late_percent || 0,
                                                overallPerformance?.undone_percent || 0
                                            ])[0]} transform="rotate(-90 80 80)" />
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#FFA726" strokeWidth="12"
                                                    strokeLinecap="round" style={getMultiColorDonutStyle([
                                                overallPerformance?.ontime_percent || 0,
                                                overallPerformance?.late_percent || 0,
                                                overallPerformance?.undone_percent || 0
                                            ])[1]} transform="rotate(-90 80 80)" />
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="#FF6B6B" strokeWidth="12"
                                                    strokeLinecap="round" style={getMultiColorDonutStyle([
                                                overallPerformance?.ontime_percent || 0,
                                                overallPerformance?.late_percent || 0,
                                                overallPerformance?.undone_percent || 0
                                            ])[2]} transform="rotate(-90 80 80)" />
                                            <text x="80" y="80" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2C868B">
                                                عملکرد کلی
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="performance-card delay-card">
                                <div className="performance-card__header">
                                    <h2 className="performance-card__title">نمودار اهمال‌کاری</h2>
                                    <p className="performance-card__description">میانگین تاخیر در انجام تسک‌ها</p>
                                </div>
                                <div className="delay-content">
                                    <div className="delay-item">
                                        <div className="delay-icon" style={{ backgroundColor: '#FFA726' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="white"/>
                                            </svg>
                                        </div>
                                        <div className="delay-info">
                                            <span className="delay-label">تسک‌های با تاخیر</span>
                                            <span className="delay-time">{formatDelayTime(averageDelay?.average_late_days || 0)}</span>
                                        </div>
                                    </div>
                                    <div className="delay-item">
                                        <div className="delay-icon" style={{ backgroundColor: '#FF6B6B' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="white"/>
                                            </svg>
                                        </div>
                                        <div className="delay-info">
                                            <span className="delay-label">تسک‌های تمام نشده</span>
                                            <span className="delay-time">{formatDelayTime(averageDelay?.average_undone_days || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="focus-cards-container">
                                <div className="focus-card">
                                    <div className="focus-card__header">
                                        <h3 className="focus-card__title">تمرکز امروز</h3>
                                        <p className="focus-card__subtitle">میزان زمان صرف شده</p>
                                    </div>
                                    <div className="focus-card__chart">
                                        <svg className="focus-donut-chart" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="#E8F5E9" strokeWidth="14" />
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="#38A3A5" strokeWidth="14"
                                                    strokeLinecap="round" style={getDonutStyle(getFocusPercentage(todayFocus?.total_duration || 0))}
                                                    transform="rotate(-90 80 80)" />
                                            <text x="80" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2C868B">
                                                {getFocusPercentage(todayFocus?.total_duration || 0)}%
                                            </text>
                                            <text x="80" y="95" textAnchor="middle" fontSize="11" fill="#7C7C7C">
                                                {formatDuration(todayFocus?.total_duration || 0)}
                                            </text>
                                        </svg>
                                    </div>
                                </div>

                                <div className="focus-card">
                                    <div className="focus-card__header">
                                        <h3 className="focus-card__title">تمرکز هفتگی</h3>
                                        <p className="focus-card__subtitle">میزان زمان صرف شده</p>
                                    </div>
                                    <div className="focus-card__chart">
                                        <svg className="focus-donut-chart" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="#E8F5E9" strokeWidth="14" />
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="#57CC99" strokeWidth="14"
                                                    strokeLinecap="round" style={getDonutStyle(getFocusPercentage(parseFloat(weekFocus?.total_duration || 0), 56))}
                                                    transform="rotate(-90 80 80)" />
                                            <text x="80" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2C868B">
                                                {getFocusPercentage(parseFloat(weekFocus?.total_duration || 0), 56)}%
                                            </text>
                                            <text x="80" y="95" textAnchor="middle" fontSize="11" fill="#7C7C7C">
                                                {formatDuration(parseFloat(weekFocus?.total_duration || 0))}
                                            </text>
                                        </svg>
                                    </div>
                                </div>

                                <div className="focus-card">
                                    <div className="focus-card__header">
                                        <h3 className="focus-card__title">تمرکز ماهانه</h3>
                                        <p className="focus-card__subtitle">میزان زمان صرف شده</p>
                                    </div>
                                    <div className="focus-card__chart">
                                        <svg className="focus-donut-chart" viewBox="0 0 160 160">
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="#E8F5E9" strokeWidth="14" />
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="#80ED99" strokeWidth="14"
                                                    strokeLinecap="round" style={getDonutStyle(getFocusPercentage(parseFloat(monthFocus?.total_duration || 0), 240))}
                                                    transform="rotate(-90 80 80)" />
                                            <text x="80" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2C868B">
                                                {getFocusPercentage(parseFloat(monthFocus?.total_duration || 0), 240)}%
                                            </text>
                                            <text x="80" y="95" textAnchor="middle" fontSize="11" fill="#7C7C7C">
                                                {formatDuration(parseFloat(monthFocus?.total_duration || 0))}
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="performance-card weekly-chart">
                                <div className="performance-card__header">
                                    <h2 className="performance-card__title">نمودار پیشرفت هفتگی</h2>
                                    <p className="performance-card__description">عملکرد شما در 7 روز گذشته</p>
                                </div>
                                <div className="performance-card__bar-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={weekPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                                            <XAxis dataKey="day" tick={{ fill: '#7C7C7C', fontSize: 14 }} tickLine={{ stroke: '#E0E0E0' }} />
                                            <YAxis tick={{ fill: '#7C7C7C', fontSize: 14 }} tickLine={{ stroke: '#E0E0E0' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => {
                                                if (value === 'done') return 'انجام شده';
                                                if (value === 'undone') return 'انجام نشده';
                                                return value;
                                            }} />
                                            <Bar dataKey="done" stackId="a" fill="#57CC99" shape={<CustomBar />} />
                                            <Bar dataKey="undone" stackId="a" fill="#FF6B6B" shape={<CustomBar />} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="performance-card monthly-chart">
                                <div className="performance-card__header">
                                    <h2 className="performance-card__title">نمودار پیشرفت ماهانه - {currentMonth}</h2>
                                    <p className="performance-card__description">عملکرد شما در 30 روز گذشته</p>
                                </div>
                                <div className="performance-card__bar-chart">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={monthPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                                            <XAxis dataKey="day" tick={{ fill: '#7C7C7C', fontSize: 11 }} tickLine={{ stroke: '#E0E0E0' }} interval={0} />
                                            <YAxis tick={{ fill: '#7C7C7C', fontSize: 14 }} tickLine={{ stroke: '#E0E0E0' }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => {
                                                if (value === 'done') return 'انجام شده';
                                                if (value === 'undone') return 'انجام نشده';
                                                return value;
                                            }} />
                                            <Bar dataKey="done" stackId="a" fill="#57CC99" shape={<CustomBar />} />
                                            <Bar dataKey="undone" stackId="a" fill="#FF6B6B" shape={<CustomBar />} />
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