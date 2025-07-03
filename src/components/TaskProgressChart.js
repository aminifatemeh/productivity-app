import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    defs,
} from "recharts";
import "./TaskProgressChart.scss";

function TaskProgressChart({ data, width = 400, height = 250 }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { day, progress } = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{
                    background: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <p><strong>{day}</strong></p>
                    <p>پیشرفت: {progress}%</p>
                </div>
            );
        }

        return null;
    };

    const getDayLetter = (day) => {
        const dayMap = {
            Saturday: "ش",
            Sunday: "ی",
            Monday: "د",
            Tuesday: "س",
            Wednesday: "چ",
            Thursday: "پ",
            Friday: "ج",
        };
        return dayMap[day] || day;
    };

    const formattedData = data.map((item) => ({
        ...item,
        dayLetter: getDayLetter(item.day),
    }));

    const gradientIds = ["gradGreen", "gradBlue", "gradPink"];

    return (
        <BarChart width={width} height={height} data={formattedData}>
            {/* تعریف گرادینت‌ها */}
            <defs>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93F9B9" />
                    <stop offset="100%" stopColor="#1D976C" />
                </linearGradient>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6DD5ED" />
                    <stop offset="100%" stopColor="#2193B0" />
                </linearGradient>
                <linearGradient id="gradPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC6EAD" />
                    <stop offset="100%" stopColor="#3494E6" />
                </linearGradient>
            </defs>


            <XAxis dataKey="dayLetter" />
            <YAxis domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} tickMargin={30}/>
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="progress" barSize={30} radius={[5, 5, 0, 0]}>
                {formattedData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={`url(#${gradientIds[index % gradientIds.length]})`}
                    />
                ))}
            </Bar>
        </BarChart>
    );
}

export default TaskProgressChart;
