import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { tasksAPI } from "../../api/apiService";
import "./WeeklyChart.scss";

const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const processWeekData = (data) => {
    const todayIndex = (new Date().getDay() + 1) % 7;
    return Array.from({ length: 7 }, (_, i) => {
        const dayData = data[(6 - i).toString()] || { done: 0, undone: 0 };
        return {
            day: persianDays[(todayIndex - (6 - i) + 7) % 7],
            done: dayData.done,
            undone: dayData.undone,
            total: dayData.done + dayData.undone,isToday: i === 6
        };
    });
};

const CustomBar = ({ fill, x, y, width, height, payload }) => (
    <g>
        <rect
            x={x} y={y} width={width} height={height}
            fill={fill}
            stroke={payload.isToday ? '#2C868B' : 'none'}
            strokeWidth={payload.isToday ? 2 : 0}
            rx={4} ry={4}
        /></g>
);

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="chart-tooltip">
            <p className="chart-tooltip__day">{d.day}</p>
            <div className="chart-tooltip__row">
                <span className="dot dot--done" />
                <span>انجام شده: <strong>{d.done}</strong></span>
            </div>
            <div className="chart-tooltip__row">
                <span className="dot dot--undone" />
                <span>انجام نشده: <strong>{d.undone}</strong></span>
            </div>
            <div className="chart-tooltip__total">مجموع: <strong>{d.total}</strong></div>
        </div>
    );
};

export default function WeeklyChart() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        tasksAPI.getWeekPerformance()
            .then(res => setData(processWeekData(res)))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="weekly-chart">
            <div className="weekly-chart__header">
                <h3 className="weekly-chart__title">نمودار پیشرفت هفتگی</h3>
                <span className="weekly-chart__badge">۷ روز اخیر</span>
            </div>

            {loading ? (
                <div className="weekly-chart__state">
                    <div className="spinner" />
                    <p>در حال بارگذاری...</p>
                </div>
            ) : data ? (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="doneGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#57CC99" stopOpacity={1} />
                                <stop offset="100%" stopColor="#38A3A5" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="undoneGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF8E8E" stopOpacity={1} />
                                <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0.8} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8EBE4" vertical={false} />
                        <XAxis dataKey="day" tick={{ fill: '#7C7C7C', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#E8EBE4' }} />
                        <YAxis tick={{ fill: '#7C7C7C', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(44,134,139,0.05)' }} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ paddingTop: '16px', fontSize: '13px' }}
                            formatter={v => v === 'done' ? 'انجام شده' : 'انجام نشده'}
                        />
                        <Bar dataKey="done" stackId="a" fill="url(#doneGrad)" shape={<CustomBar />} />
                        <Bar dataKey="undone" stackId="a" fill="url(#undoneGrad)" shape={<CustomBar />} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="weekly-chart__state weekly-chart__state--error">خطا در بارگذاری نمودار</div>
            )}
        </div>
    );
}
