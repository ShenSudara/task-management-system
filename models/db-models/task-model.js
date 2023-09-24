const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: {
    type: Number,
  },

  taskName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true,
    match: [
      /^(?!\s*$)[a-zA-Z0-9.,()[\]\s]*$/,
      "please provide valid task name",
    ],
  },

  taskDescription: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 2000,
    match: [/^(.|\s)*[a-zA-Z]+(.|\s)*$/, "please provide valid description"],
  },

  startedAt: {
    type: Date,
    default: new Date(),
  },

  endAt: {
    type: Date,
    default: new Date(),
  },

  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  lastCreated: {
    type: Date,
    default: new Date(),
  },

  lastUpdated: {
    type: Date,
    default: new Date(),
  },

  activeStatus: {
    type: Boolean,
    default: true,
  },
});

taskSchema.pre("save", async function () {
  const taskId = await this.constructor
    .findOne()
    .sort({ taskId: -1 })
    .limit(1)
    .select("taskId");

  this.taskId = (taskId ? taskId.taskId : 0) + 1;
});

const taskModel = mongoose.model("tasks", taskSchema);
module.exports = taskModel;
