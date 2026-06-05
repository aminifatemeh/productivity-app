import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    return localStorage.getItem("accessToken") ? <Outlet /> : <Navigate to="/" replace />;
}
