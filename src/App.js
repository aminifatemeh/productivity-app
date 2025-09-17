import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<LoginForm/>}></Route>
                <Route path='/' element={<DashboardPage/>}></Route>
                <Route path='/task-management' element={<TaskManagementPage/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;