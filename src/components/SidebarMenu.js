import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";

function SidebarMenu() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
      <nav className="sidebar">
        <ProfileSnippet />
        <h5 className="mt-5 sidebar__title">{t("sidebarMenu.home")}</h5>
        <ul className="sidebar__items">
          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/dashboard.svg"
                alt="dashboard"
            />
            <Link to="/" onClick={(e) => handleNavigation(e, "/")}>
              {t("sidebarMenu.dashboard")}
            </Link>
          </li>

          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/task-management.svg"
                alt="task-management"
            />
            <Link
                to="/task-management"
                onClick={(e) => handleNavigation(e, "/task-management")}
            >
              {t("sidebarMenu.taskManagement")}
            </Link>
          </li>

          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/vision.svg"
                alt="vision"
            />
            <Link
                to="/vision"
                onClick={(e) => handleNavigation(e, "/vision")}
            >
              {t("sidebarMenu.vision")}
            </Link>
          </li>

          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/performance-graph.svg"
                alt="charts"
            />
            <Link
                to="/charts"
                onClick={(e) => handleNavigation(e, "/charts")}
            >
              {t("sidebarMenu.charts")}
            </Link>
          </li>

          <li>
            <img
                className="sidebar__icons"
                src="/assets/icons/settings.svg"
                alt="settings"
            />
            <Link to="/settings" onClick={(e) => handleNavigation(e, "/settings")}>
              {t("sidebarMenu.settings")}
            </Link>
          </li>
        </ul>

        <div className="sidebar__logout">
          <button onClick={handleLogout}>
            <img className="sidebar__icons" src="/assets/icons/exit.svg" alt="exit" />
            <span>{t("sidebarMenu.logout")}</span>
          </button>
        </div>
      </nav>
  );
}

export default SidebarMenu;