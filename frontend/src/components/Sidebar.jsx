import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <h2 className="sidebar-brand">TaskFlow</h2>

                <nav className="sidebar-nav">
                    <NavLink to="/" end>Dashboard</NavLink>
                    <NavLink to="/tasks">My Tasks</NavLink>

                    {isAdmin && (
                        <>
                            <div className="sidebar-divider"></div>
                            <span className="sidebar-label">Admin</span>
                            <NavLink to="/admin/users">Users</NavLink>
                            <NavLink to="/admin/tasks">All Tasks</NavLink>
                            <NavLink to="/admin/logs">Activity Logs</NavLink>
                        </>
                    )}
                </nav>
            </div>

            <div className="sidebar-bottom">
                <div className="sidebar-user">
                    <span className="sidebar-user-name">{user?.name}</span>
                    <span className="sidebar-user-role">{user?.role}</span>
                </div>
                <button className="sidebar-logout" onClick={logout}>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
