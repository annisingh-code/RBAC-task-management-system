import { useState, useEffect } from "react";
import api from "../../api/api";
import "./UserManagement.css";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data.users);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to update status");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to delete user");
        }
    };

    if (loading) return <div className="page-loader">Loading users...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>User Management</h1>
                <p>{users.length} registered users</p>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td className="td-name">{u.username}</td>
                            <td>{u.email}</td>
                            <td>
                                <span className={`badge ${u.role === "admin" ? "badge-blue" : "badge-gray"}`}>
                                    {u.role}
                                </span>
                            </td>
                            <td>
                                <span className={`badge ${u.status === "active" ? "badge-green" : "badge-red"}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td className="td-date">
                                {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                                <div className="action-btns">
                                    <button
                                        className="btn-sm btn-edit"
                                        onClick={() => handleStatusToggle(u._id, u.status)}
                                    >
                                        {u.status === "active" ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        className="btn-sm btn-delete"
                                        onClick={() => handleDelete(u._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;
