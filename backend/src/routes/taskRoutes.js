const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { createTask, getMyTasks, updateTask, deleteTask } = require("../controllers/taskController");

const taskRouter = express.Router();

// all task routes need authentication
taskRouter.use(authMiddleware);

taskRouter.post("/", createTask);
taskRouter.get("/my", getMyTasks);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

module.exports = taskRouter;
