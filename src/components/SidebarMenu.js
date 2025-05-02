import React from "react";
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";

function SidebarMenu() {
  return (
    <nav className="sidebar">
        <ProfileSnippet username='فاطمه امینی' userstatus='کاربر عادی'/>
      <h5 className="mt-5 text-end">خانه</h5>
      <ul className="sidebar__items">
        <li>
          <a href="#">داشبورد</a>
          <img
            className="sidebar__icons"
            src="/assets/icons/dashboard.svg"
            alt=""
          />
        </li>
        <li>
          <a href="#">مدیریت تسک</a>
          <img
            className="sidebar__icons"
            src="/assets/icons/task-management.svg"
            alt=""
          />
        </li>
        <li>
          <a href="#">نمودارها</a>
          <img
            className="sidebar__icons"
            src="/assets/icons/performance-graph.svg"
            alt=""
          />
        </li>
          <li>
              <a href="#">تنظیمات</a>
              <img
                  className="sidebar__icons"
                  src="/assets/icons/settings.svg"
                  alt=""
              />
          </li>
      </ul>
    </nav>
  );
}

export default SidebarMenu;
