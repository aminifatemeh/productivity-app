import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TaskProvider } from "./components/TaskContext";
import LoginForm from "./pages/LoginPage";
import RegisterForm from "./pages/RegisterForm";
import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
    return (
        <TaskProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/" element={<DashboardPage />} />
                    <Route
                        path="/task-management"
                        element={<TaskManagementPage useApi={true} />}
                    />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Router>
        </TaskProvider>
    );
}

export default App;