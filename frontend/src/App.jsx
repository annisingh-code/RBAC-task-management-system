import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTasks from "./pages/MyTasks";
import UserManagement from "./pages/admin/UserManagement";
import TaskMonitoring from "./pages/admin/TaskMonitoring";

import Dashboard from "./pages/Dashboard";
import ActivityLogs from "./pages/admin/ActivityLogs";

function App() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* public routes */}
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

            {/* protected routes with dashboard layout */}
            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<MyTasks />} />

                {/* admin only routes */}
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/tasks" element={<AdminRoute><TaskMonitoring /></AdminRoute>} />
                <Route path="/admin/logs" element={<AdminRoute><ActivityLogs /></AdminRoute>} />
            </Route>

            {/* catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
