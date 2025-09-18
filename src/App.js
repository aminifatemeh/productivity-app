import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TaskProvider } from "./components/TaskContext";
import LoginForm from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TaskManagementPage from "./pages/TaskManagementPage";

function App() {
  return (
    <TaskProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/" element={<DashboardPage />}></Route>
          <Route
            path="/task-management"
            element={<TaskManagementPage useApi={false} />}
          ></Route>
          {/*<TaskManagementPage useApi={true} />*/}
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;
