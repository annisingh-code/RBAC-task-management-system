import { useState, useEffect } from "react";
import api from "../api/api";
import "./MyTasks.css";

function MyTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    // form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [status, setStatus] = useState("pending");

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks/my");
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

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("pending");
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingId) {
                await api.put(`/tasks/${editingId}`, { title, description, priority, status });
            } else {
                await api.post("/tasks", { title, description, priority, status });
            }
            resetForm();
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong");
        }
    };

    const handleEdit = (task) => {
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setEditingId(task._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;

        try {
            await api.delete(`/tasks/${id}`);
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

    const getPriorityClass = (priority) => {
        if (priority === "high") return "badge-red";
        if (priority === "medium") return "badge-yellow";
        return "badge-gray";
    };

    if (loading) return <div className="page-loader">Loading tasks...</div>;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>My Tasks</h1>
                        <p>Manage your tasks</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                    >
                        {showForm ? "Cancel" : "+ New Task"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="task-form-card">
                    <h3>{editingId ? "Edit Task" : "Create Task"}</h3>
                    {error && <div className="form-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional description"
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            {editingId ? "Update Task" : "Create Task"}
                        </button>
                    </form>
                </div>
            )}

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>No tasks yet. Create your first task!</p>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
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
                                <td>
                                    <span className={`badge ${getStatusClass(task.status)}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${getPriorityClass(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="td-date">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="btn-sm btn-edit" onClick={() => handleEdit(task)}>
                                            Edit
                                        </button>
                                        <button className="btn-sm btn-delete" onClick={() => handleDelete(task._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyTasks;
