const Task = require("../models/Task");

// create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;

        if (!title) {
            return res.status(400).json({ msg: "Task title is required" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            createdBy: req.user.id
        });

        return res.status(201).json({ msg: "Task created", task });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// get all tasks for the logged-in user
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ tasks });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// update a task (only if it belongs to the user)
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        // make sure user owns this task
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "You can only update your own tasks" });
        }

        const { title, description, status, priority } = req.body;

        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();

        return res.status(200).json({ msg: "Task updated", task });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// delete a task (only if it belongs to the user)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: "Task not found" });
        }

        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "You can only delete your own tasks" });
        }

        await Task.findByIdAndDelete(req.params.id);

        return res.status(200).json({ msg: "Task deleted" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { createTask, getMyTasks, updateTask, deleteTask };
