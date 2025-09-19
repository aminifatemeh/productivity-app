import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";

function SidebarMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    navigate('/'); // Redirect to dashboard
  };

  const handleNavigation = (e, path) => {
    e.preventDefault(); // Prevent default to ensure no event bubbling issues
    navigate(path);
  };

  return (
      <nav className="sidebar">
        <ProfileSnippet />
        <h5 className="mt-5 text-end">خانه</h5>
        <ul className="sidebar__items">
          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/dashboard.svg"
                alt=""
            />
            <Link to="/" onClick={(e) => handleNavigation(e, '/')}>داشبورد</Link>
          </li>
          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/task-management.svg"
                alt=""
            />
            <Link to="/task-management" onClick={(e) => handleNavigation(e, '/task-management')}>مدیریت تسک</Link>
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
            <Link to="/settings" onClick={(e) => handleNavigation(e, '/settings')}>تنظیمات</Link>
          </li>
        </ul>
        <div className="sidebar__logout">
          <button onClick={handleLogout}>
            <img className='sidebar__icons' src="/assets/icons/exit.svg" alt="exit" />
            <span>خروج</span>
          </button>
        </div>
      </nav>
  );
}

export default SidebarMenu;