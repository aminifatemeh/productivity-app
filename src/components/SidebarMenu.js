// SidebarMenu.jsx
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";

// ── آیکون‌های inline SVG ──────────────────────────────────────────
const IconDashboard = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
);

const IconTaskManagement = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <polyline points="4,6.5 5.5,8 8,4.5" />
        <polyline points="4,12.5 5.5,14 8,10.5" />
        <polyline points="4,18.5 5.5,20 8,16.5" />
    </svg>
);


const IconVision = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);


const IconPerformance = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,18 8,12 12,15 17,8 20,10" />
      <line x1="4" y1="21" x2="20" y2="21" />
      <line x1="4" y1="4" x2="4" y2="21" />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
);

const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
             a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
             A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
             l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
             A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
             l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
             a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
             l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
             a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);


const IconExit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5" />
      <polyline points="17,16 21,12 17,8" />
      <line x1="21" y1="12" x2="10" y2="12" />
    </svg>
);
// ─────────────────────────────────────────────────────────────────

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
    { icon: <IconDashboard />,      text: t("sidebarMenu.dashboard"),      path: "/dashboard",                alt: "dashboard" },
    { icon: <IconTaskManagement />, text: t("sidebarMenu.taskManagement"), path: "/task-management", alt: "task-management" },
    { icon: <IconVision />,         text: t("sidebarMenu.vision"),         path: "/vision",          alt: "vision" },
    { icon: <IconPerformance />,    text: t("sidebarMenu.charts"),         path: "/charts",          alt: "charts" },
    { icon: <IconSettings />,       text: t("sidebarMenu.settings"),       path: "/settings",        alt: "settings" },
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
                <span className="sidebar__icon" aria-hidden="true"><IconExit /></span>
                <span>{t("sidebarMenu.logout")}</span>
              </button>
            </div>
          </div>
        </nav>
      </>
  );
}

export default SidebarMenu;
