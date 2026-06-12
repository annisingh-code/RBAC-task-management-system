const express = require("express");
const authMiddleware = require("../middlewares/auth");
const adminOnly = require("../middlewares/adminOnly");
const {
    getAllUsers,
    deleteUser,
    updateUserStatus,
    getAllTasks,
    deleteAnyTask,
    getActivityLogs,
    getDashboardStats
} = require("../controllers/adminController");

const adminRouter = express.Router();

// every admin route needs auth + admin check
adminRouter.use(authMiddleware, adminOnly);

// user management
adminRouter.get("/users", getAllUsers);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.patch("/users/:id/status", updateUserStatus);

// task management
adminRouter.get("/tasks", getAllTasks);
adminRouter.delete("/tasks/:id", deleteAnyTask);

// activity logs
adminRouter.get("/logs", getActivityLogs);

// dashboard stats
adminRouter.get("/stats", getDashboardStats);

module.exports = adminRouter;
