import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyTasks from "./pages/MyTasks";

function PlaceholderPage({ title }) {
    return (
        <div className="page-header">
            <h1>{title}</h1>
            <p>Coming soon...</p>
        </div>
    );
}

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
                <Route path="/" element={<PlaceholderPage title="Dashboard" />} />
                <Route path="/tasks" element={<MyTasks />} />
            </Route>

            {/* catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
