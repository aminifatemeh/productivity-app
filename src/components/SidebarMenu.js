import React from "react";
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";
import { Link } from 'react-router-dom';

function SidebarMenu() {
  return (
    <nav className="sidebar">
      <ProfileSnippet username="فاطمه امینی" userstatus="کاربر عادی" />
      <h5 className="mt-5 text-end">خانه</h5>
      <ul className="sidebar__items">
        <li>
          <img
              className="sidebar__icons"
              src="/assets/icons/dashboard.svg"
              alt=""
          />
          <Link to="/">داشبورد</Link>
        </li>
        <li>
          <img
              className="sidebar__icons"
              src="/assets/icons/task-management.svg"
              alt=""
          />
          <Link to="/task-management">مدیریت تسک</Link>
        </li>
        <li>
          <img
              className="sidebar__icons"
              src="/assets/icons/performance-graph.svg"
              alt=""
          />
          <a href="#">نمودارها</a>
        </li>
        <li>
          <img
              className="sidebar__icons"
              src="/assets/icons/settings.svg"
              alt=""
          />
          <a href="#">تنظیمات</a>
        </li>
      </ul>
      <div className="sidebar__logout">
        <button>
          <img className='sidebar__icons' src="/assets/icons/exit.svg" alt="exit" />
          <span>خروج</span>
        </button>
      </div>
    </nav>
  );
}

export default SidebarMenu;
