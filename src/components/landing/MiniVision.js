import React, { useState } from "react";
import "./MiniVision.scss";

const MONTH_NAME = "خرداد";
const YEAR = "۱۴۰۴";

const DAYS = [
    {
        day: 1,
        dayName: "شنبه",
        gradient: "linear-gradient(135deg, rgb(100, 181, 246), rgb(115, 196, 261))",
        tasks: [
            { id: 1, title: "مطالعه فصل ۳", time: "۱۰:۰۰" },
            { id: 2, title: "تمرین ریاضی", time: null },
        ],
    },
    {
        day: 2,
        dayName: "یکشنبه",
        gradient: "linear-gradient(135deg, rgb(107, 186, 196), rgb(122, 201, 211))",
        tasks: [],
    },
    {
        day: 3,
        dayName: "دوشنبه",
        gradient: "linear-gradient(135deg, rgb(114, 191, 146), rgb(129, 206, 161))",
        tasks: [
            { id: 3, title: "پروژه گروهی شیمی", time: "۱۴:۳۰" },
        ],
    },
    {
        day: 4,
        dayName: "سه‌شنبه",
        gradient: "linear-gradient(135deg, rgb(121, 196, 116), rgb(136, 211, 131))",
        tasks: [
            { id: 4, title: "مرور ادبیات", time: null },
            { id: 5, title: "تکلیف زیست", time: "۱۶:۰۰" },
            { id: 6, title: "کلاس زبان", time: "۱۸:۰۰" },
        ],
    },
    {
        day: 5,
        dayName: "چهارشنبه",
        gradient: "linear-gradient(135deg, rgb(128, 201, 106), rgb(143, 216, 121))",
        tasks: [],
    },
    {
        day: 6,
        dayName: "پنج‌شنبه",
        gradient: "linear-gradient(135deg, rgb(110, 196, 126), rgb(125, 211, 141))",
        tasks: [
            { id: 7, title: "آمادگی امتحان", time: "۰۹:۰۰" },
        ],
    },
];

const FUNNY = ["امروز رو استراحتی! 😎", "روز آزاد! ✈️", "آرامش مطلق... 🧘‍♂️"];

function MiniVision() {
    const [activeMonth, setActiveMonth] = useState(MONTH_NAME);

    return (
      <div className="mini-vision" dir="rtl">
        {/* Header — همون vision-header ولی کوچک‌تر */}
        <div className="mini-vision__header">
          <button className="mini-vision__nav">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
          <div className="mini-vision__month">
            <span className="mini-vision__month-name">{MONTH_NAME}</span>
            <span className="mini-vision__year">{YEAR}</span>
          </div>
          <button className="mini-vision__nav">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>
        </div>

        {/* Grid — همون calendar-grid */}
        <div className="mini-vision__grid">
          {DAYS.map(({ day, dayName, gradient, tasks }, i) => (
            <div
              key={day}
              className="mini-vision__card"
              style={{ "--card-gradient": gradient }}
            >
              <div
                className="mini-vision__card-header"
                style={{ background: gradient }}
              >
                <div className="mini-vision__day-info">
                  <span className="mini-vision__day-num">{day}</span>
                  <span className="mini-vision__day-name">{dayName}</span>
                </div>
                <span className="mini-vision__month-label">{MONTH_NAME}</span>
              </div>
              <div className="mini-vision__tasks">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div key={task.id} className="mini-vision__task-item">
                      <span className="mini-vision__task-title">
                        {task.title}
                      </span>
                      {task.time && (
                        <span className="mini-vision__task-time">
                          ⏰ {task.time}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="mini-vision__empty">
                    {FUNNY[i % FUNNY.length]}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default MiniVision;