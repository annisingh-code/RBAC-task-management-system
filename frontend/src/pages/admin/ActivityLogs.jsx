import { useState, useEffect } from "react";
import api from "../../api/api";
import "./ActivityLogs.css";

function ActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await api.get("/admin/logs");
            setLogs(res.data.logs);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionBadge = (action) => {
        if (action.includes("CREATE")) return "badge-green";
        if (action.includes("DELETE")) return "badge-red";
        if (action.includes("UPDATE")) return "badge-yellow";
        if (action === "LOGIN") return "badge-blue";
        return "badge-gray";
    };

    if (loading) return <div className="page-loader">Loading activity logs...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>Activity Logs</h1>
                <p>Recent system activity across all users</p>
            </div>

            {logs.length === 0 ? (
                <div className="empty-state">
                    <p>No activity recorded yet.</p>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Details</th>
                            <th>IP Address</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>
                                    <span className={`badge ${getActionBadge(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td>
                                    <span className="log-user">{log.user?.username || "Unknown"}</span>
                                    <span className="log-email">{log.user?.email}</span>
                                </td>
                                <td className="log-details">{log.details}</td>
                                <td className="log-ip">{log.ipAddress || "N/A"}</td>
                                <td className="td-date">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ActivityLogs;
