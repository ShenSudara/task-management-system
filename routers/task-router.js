const express = require("express");
const { createTask, getAllTasks } = require("../controllers/task-controller");
const taskRouter = express.Router();

taskRouter.route("/").post(createTask).get(getAllTasks);
module.exports = taskRouter;
