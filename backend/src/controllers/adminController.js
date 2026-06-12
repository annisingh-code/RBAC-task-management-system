const User = require("../models/User");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");

// get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ users });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// delete a user by id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // don't allow deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ msg: "You cannot delete your own account" });
        }

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({ msg: "User deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// update user status (active/inactive)
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !["active", "inactive"].includes(status)) {
            return res.status(400).json({ msg: "Status must be 'active' or 'inactive'" });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.status = status;
        await user.save();

        return res.status(200).json({ msg: `User status updated to ${status}` });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// get all tasks in the system
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ tasks });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// delete any task by id
const deleteAnyTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        await Task.findByIdAndDelete(req.params.id);

        return res.status(200).json({ msg: "Task deleted by admin" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// get activity logs
const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("user", "username email")
            .sort({ createdAt: -1 })
            .limit(100);

        return res.status(200).json({ logs });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, deleteUser, updateUserStatus, getAllTasks, deleteAnyTask, getActivityLogs };
