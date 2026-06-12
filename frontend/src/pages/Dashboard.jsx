import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import "./Dashboard.css";

function Dashboard() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(isAdmin); // only load stats if admin

    useEffect(() => {
        if (isAdmin) {
            const fetchStats = async () => {
                try {
                    const res = await api.get("/admin/stats");
                    setStats(res.data.stats);
                } catch (err) {
                    console.error("Failed to fetch stats:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [isAdmin]);

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back, {user?.name}!</p>
            </div>

            {isAdmin ? (
                loading ? (
                    <div className="page-loader">Loading stats...</div>
                ) : stats ? (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value">{stats.totalUsers}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">Total Tasks</div>
                            <div className="stat-value">{stats.totalTasks}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">Completed Tasks</div>
                            <div className="stat-value text-green">{stats.completedTasks}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-title">Pending Tasks</div>
                            <div className="stat-value text-yellow">{stats.pendingTasks}</div>
                        </div>
                    </div>
                ) : (
                    <p>Failed to load statistics.</p>
                )
            ) : (
                <div className="user-welcome">
                    <h3>Get started with your tasks</h3>
                    <p>Head over to the My Tasks section to manage your workload.</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
