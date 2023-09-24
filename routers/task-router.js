const express = require("express");
const { createTask } = require("../controllers/task-controller");
const taskRouter = express.Router();

taskRouter.route("/").post(createTask);
module.exports = taskRouter;
