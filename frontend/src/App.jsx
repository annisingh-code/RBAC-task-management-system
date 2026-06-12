import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* public routes */}
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

            {/* protected routes - placeholder for now */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <div style={{ padding: 40 }}>
                            <h2>Dashboard coming soon...</h2>
                            <p>Logged in as {user?.name}</p>
                        </div>
                    </ProtectedRoute>
                }
            />

            {/* catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
