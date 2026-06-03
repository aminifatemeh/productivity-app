// layouts/MainLayout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarMenu from '../components/SidebarMenu';
import './MainLayout.scss';

function MainLayout({ children }) {
    const location = useLocation();

    // صفحاتی که sidebar ندارن
    const noSidebarRoutes = ['/login', '/register', '/'];
    const showSidebar = !noSidebarRoutes.includes(location.pathname);

    return (
        <div className={`app-layout ${showSidebar ? 'with-sidebar' : 'no-sidebar'}`}>
            {showSidebar && <SidebarMenu />}
            <div className={`page-content ${showSidebar ? 'has-sidebar' : 'full-width'}`}>
                {children}
            </div>
        </div>
    );
}

export default MainLayout;
