import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TaskProvider } from "./api/TaskContext";
import { LanguageProvider } from "./context/LanguageContext";
import MainLayout from "./layouts/MainLayout";
import LoginForm from "./pages/LoginPage";
import RegisterForm from "./pages/RegisterForm";
import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";
import SettingsPage from "./pages/SettingsPage";
import VisionPage from "./pages/VisionPage";
import ChartsPage from "./pages/ChartsPage";
import LandingPage from "./pages/LandingPage";  // ← اضافه شد

function App() {
    return (
        <LanguageProvider>
            <TaskProvider>
                <Router>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />          {/* ← لندینگ */}
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/dashboard" element={<DashboardPage />} /> {/* ← مسیر جدید */}
                            <Route path="/task-management" element={<TaskManagementPage useApi={true} />} />
                            <Route path="/vision" element={<VisionPage />} />
                            <Route path="/charts" element={<ChartsPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </MainLayout>
                </Router>
            </TaskProvider>
        </LanguageProvider>
    );
}

export default App;
