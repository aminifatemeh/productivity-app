import React, { createContext, useState } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "تهیه گزارش ماهانه پروژه",
            description: "جمع‌آوری داده‌های فروش و تهیه گزارش برای جلسه تیم مدیریت",
            deadline_date: "۱۴۰۴/۰۷/۱۰",
            flag_tuNobat: false,
            hour: "09:30",
            selectedDays: [],
            tags: [{ name: "کار", color: "#DA348D", selected: true }],
            subtasks: [
                { id: 1, title: "جمع‌آوری داده‌های فروش", done_date: null },
                { id: 2, title: "تحلیل داده‌ها", done_date: null },
                { id: 3, title: "طراحی اسلایدها", done_date: "۱۴۰۴/۰۶/۳۰" },
            ],
            isDone: false,
        },
        {
            id: 2,
            title: "تمرین برنامه‌نویسی پایتون",
            description: "تمرین پروژه جنگو برای بهبود مهارت‌های کدنویسی",
            deadline_date: "۱۴۰۴/۰۷/۱۵",
            flag_tuNobat: true,
            hour: "18:00",
            selectedDays: ["ش", "د", "چ"],
            tags: [
                { name: "تحصیل", color: "#4690E4", selected: true },
                { name: "برنامه‌نویسی", color: "#34AA7B", selected: true },
            ],
            subtasks: [
                { id: 4, title: "یادگیری مدل‌های جنگو", done_date: null },
                { id: 5, title: "ساخت یک API ساده", done_date: null },
            ],
            isDone: false,
        },
        {
            id: 3,
            title: "خرید مواد غذایی هفتگی",
            description: "خرید مواد لازم برای آشپزی هفته آینده",
            deadline_date: "۱۴۰۴/۰۶/۳۱",
            flag_tuNobat: false,
            hour: "16:00",
            selectedDays: [],
            tags: [{ name: "شخصی", color: "#FFCA28", selected: true }],
            subtasks: [
                { id: 6, title: "تهیه لیست خرید", done_date: "۱۴۰۴/۰۶/۲۹" },
                { id: 7, title: "بازدید از سوپرمارکت", done_date: null },
            ],
            isDone: true, // برای نمایش در archived
        },
        {
            id: 4,
            title: "تمرین بدنسازی",
            description: "جلسه تمرین در باشگاه برای تقویت عضلات",
            deadline_date: "۱۴۰۴/۰۷/۱۲",
            flag_tuNobat: true,
            hour: "17:30",
            selectedDays: ["ی", "س", "پ"],
            tags: [{ name: "ورزش", color: "#34AA7B", selected: true }],
            subtasks: [
                { id: 8, title: "گرم کردن", done_date: null },
                { id: 9, title: "تمرینات بالاتنه", done_date: null },
                { id: 10, title: "سرد کردن", done_date: null },
            ],
            isDone: false,
        },
        {
            id: 5,
            title: "مطالعه کتاب مدیریت زمان",
            description: "خواندن فصل‌های ۵ تا ۷ برای امتحان هفته آینده",
            deadline_date: "۱۴۰۴/۰۷/۰۸",
            flag_tuNobat: false,
            hour: "20:00",
            selectedDays: [],
            tags: [{ name: "تحصیل", color: "#4690E4", selected: true }],
            subtasks: [
                { id: 11, title: "خواندن فصل ۵", done_date: "۱۴۰۴/۰۶/۲۸" },
                { id: 12, title: "یادداشت‌برداری فصل ۶", done_date: null },
            ],
            isDone: false,
        },
    ]);

    return (
        <TaskContext.Provider value={{ tasks, setTasks }}>
            {children}
        </TaskContext.Provider>
    );
};