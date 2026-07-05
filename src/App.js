import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TaskProvider } from "./api/TaskContext";
import { LanguageProvider } from "./context/LanguageContext";
import MainLayout from "./layouts/MainLayout";
import LoginForm from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";
import SettingsPage from "./pages/SettingsPage";
import VisionPage from "./pages/VisionPage";
import ChartsPage from "./pages/ChartsPage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <LanguageProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterPage />} /><Route element={<ProtectedRoute />}>
                    <Route path="*" element={
                        <TaskProvider>
                            <MainLayout>
                                <Routes>
                                    <Route path="dashboard" element={<DashboardPage />} />
                                    <Route path="task-management" element={<TaskManagementPage useApi={true} />} />
                                    <Route path="vision" element={<VisionPage />} />
                                    <Route path="charts" element={<ChartsPage />} />
                                    <Route path="settings" element={<SettingsPage />} />
                                </Routes>
                            </MainLayout>
                        </TaskProvider>
                    } />
                </Route>
                </Routes>
            </Router>
        </LanguageProvider>
    );
}

export default App;
