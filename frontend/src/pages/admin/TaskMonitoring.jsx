import { useState, useEffect } from "react";
import api from "../../api/api";
import "./TaskMonitoring.css";

function TaskMonitoring() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/admin/tasks");
            setTasks(res.data.tasks);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;

        try {
            await api.delete(`/admin/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to delete");
        }
    };

    const getStatusClass = (status) => {
        if (status === "completed") return "badge-green";
        if (status === "in-progress") return "badge-yellow";
        return "badge-gray";
    };

    if (loading) return <div className="page-loader">Loading tasks...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>Task Monitoring</h1>
                <p>All tasks created by users ({tasks.length} total)</p>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>No tasks in the system yet.</p>
                </div>
            ) : (
                <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Created By</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td>
                                        <span className="task-title">{task.title}</span>
                                        {task.description && (
                                            <span className="task-desc">{task.description}</span>
                                        )}
                                    </td>
                                    <td className="td-creator">
                                        {task.createdBy?.username || "Unknown"}
                                        <span className="td-email">{task.createdBy?.email}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${task.priority === "high" ? "badge-red" : task.priority === "medium" ? "badge-yellow" : "badge-gray"}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="td-date">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button className="btn-sm btn-delete" onClick={() => handleDelete(task._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            )}
        </div>
    );
}

export default TaskMonitoring;
