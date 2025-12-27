import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import "./SidebarMenu.scss";
import ProfileSnippet from "./ProfileSnippet";

function SidebarMenu() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // بستن منو هنگام تغییر صفحه در موبایل
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      icon: "/assets/icons/dashboard.svg",
      text: t("sidebarMenu.dashboard"),
      path: "/",
      alt: "dashboard"
    },
    {
      icon: "/assets/icons/task-management.svg",
      text: t("sidebarMenu.taskManagement"),
      path: "/task-management",
      alt: "task-management"
    },
    {
      icon: "/assets/icons/vision.svg",
      text: t("sidebarMenu.vision"),
      path: "/vision",
      alt: "vision"
    },
    {
      icon: "/assets/icons/performance-graph.svg",
      text: t("sidebarMenu.charts"),
      path: "/charts",
      alt: "charts"
    },
    {
      icon: "/assets/icons/settings.svg",
      text: t("sidebarMenu.settings"),
      path: "/settings",
      alt: "settings"
    }
  ];

  return (
      <>
        {/* دکمه همبرگر */}
        {isMobile && (
            <button
                className={`hamburger ${isOpen ? 'active' : ''}`}
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
        )}

        {/* Overlay برای بستن منو در موبایل */}
        {isMobile && isOpen && (
            <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
        )}

        {/* Sidebar */}
        <nav className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
          <div className="sidebar__content">
            <ProfileSnippet />

            <h5 className="sidebar__title">{t("sidebarMenu.home")}</h5>

            <ul className="sidebar__items">
              {menuItems.map((item, index) => (
                  <li
                      key={index}
                      className={location.pathname === item.path ? 'active' : ''}
                  >
                    <Link to={item.path} onClick={(e) => handleNavigation(e, item.path)}>
                      <img
                          className="sidebar__icons"
                          src={item.icon}
                          alt={item.alt}
                      />
                      <span>{item.text}</span>
                    </Link>
                  </li>
              ))}
            </ul>

            <div className="sidebar__logout">
              <button onClick={handleLogout}>
                <img className="sidebar__icons" src="/assets/icons/exit.svg" alt="exit" />
                <span>{t("sidebarMenu.logout")}</span>
              </button>
            </div>
          </div>
        </nav>
      </>
  );
}

export default SidebarMenu;