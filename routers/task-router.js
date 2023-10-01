const express = require("express");
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/task-controller");
const taskRouter = express.Router();

taskRouter.route("/").post(createTask).get(getAllTasks);
taskRouter.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = taskRouter;
