// SidebarMenu.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";
import {
    DashboardIcon,
    TaskListIcon,
    EyeIcon,
    ChartIcon,
    SettingsIcon,
    LogoutIcon
} from "./Icons";


function SidebarMenu() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const menuItems = [
    { icon: <DashboardIcon size={28} color={"#01575c"} />,      text: t("sidebarMenu.dashboard"),      path: "/dashboard",                alt: "dashboard" },
    { icon: <TaskListIcon size={28} color={"#01575c"}/>, text: t("sidebarMenu.taskManagement"), path: "/task-management", alt: "task-management" },
    { icon: <EyeIcon size={28} color={"#01575c"}/>,         text: t("sidebarMenu.vision"),         path: "/vision",          alt: "vision" },
    { icon: <ChartIcon size={28} color={"#01575c"}/>,    text: t("sidebarMenu.charts"),         path: "/charts",          alt: "charts" },
    { icon: <SettingsIcon size={28} color={"#01575c"}/>,       text: t("sidebarMenu.settings"),       path: "/settings",        alt: "settings" },
  ];

  return (
      <>
        {isMobile && (
            <button
                className={`hamburger ${isOpen ? "active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
        )}

        {isMobile && isOpen && (
            <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
        )}

        <nav className={`sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`}>
          <div className="sidebar__content">
            <ProfileSnippet />

            <h5 className="sidebar__title">{t("sidebarMenu.home")}</h5>

            <ul className="sidebar__items">
              {menuItems.map((item, index) => (
                  <li key={index} className={location.pathname === item.path ? "active" : ""}>
                    <Link to={item.path} onClick={(e) => handleNavigation(e, item.path)}>
                      <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
                      <span>{item.text}</span>
                    </Link>
                  </li>
              ))}
            </ul>

            <div className="sidebar__logout">
              <button onClick={handleLogout}>
                <span className="sidebar__icon" aria-hidden="true"><LogoutIcon color="white"/></span>
                <span>{t("sidebarMenu.logout")}</span>
              </button>
            </div>
          </div>
        </nav>
      </>
  );
}

export default SidebarMenu;
