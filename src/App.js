import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";

function App() {
    return (
        <Router>

            <Routes>
                <Route path='/' element={<DashboardPage/>}></Route>
                <Route path='/task-management' element={<TaskManagementPage/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
