const BadRequest = require("../errors/bad-request");
const UnprocessableEntity = require("../errors/unprocessable-entity");
const taskValidatorModel = require("../utils/validators/input-validators/models/task-validator");
const userModel = require("../models/db-models/user-model");
const InternalServerError = require("../errors/internal-server-error");
const { StatusCodes } = require("http-status-codes");
const taskModel = require("../models/db-models/task-model");
const Created = require("../models/responses/created");
const Ok = require("../models/responses/ok");
const NotFound = require("../errors/not-found");

const createTask = async (req, res) => {
  const reqPayLoad = req.body;

  //Check all keys are available
  const requestBodyKeys = [
    "taskName",
    "taskDescription",
    "startedAt",
    "endAt",
    "isCompleted",
  ];
  const keysAvailable = await requestBodyKeys.every((key) =>
    reqPayLoad.hasOwnProperty(key)
  );
  if (!keysAvailable) {
    throw new BadRequest(
      "createTask",
      "ValidationError",
      "missing required properties"
    );
  }

  //Check logged user id
  if (!req?.user?.userId) {
    throw new InternalServerError(
      "createTask",
      "AuthenticationError",
      "unable to find logged user"
    );
  }
  reqPayLoad.userObjectId = await userModel.findOne({
    userId: req.user.userId,
  });

  //Data validation
  try {
    await taskValidatorModel({
      taskName: reqPayLoad.taskName,
      taskDescription: reqPayLoad.taskDescription,
      startedAt: reqPayLoad.startedAt
        ? new Date(reqPayLoad.startedAt).toISOString()
        : null,
      endAt: reqPayLoad.endAt ? new Date(reqPayLoad.endAt).toISOString() : null,
      isCompleted: reqPayLoad.isCompleted,
    });
  } catch (error) {
    console.log(error);
    throw new UnprocessableEntity(
      "createTask",
      "ValidationError",
      "",
      error?.details
    );
  }

  //Save to the database
  //Preping data for saving
  const savedTask = await taskModel.create({
    taskName: reqPayLoad.taskName,
    taskDescription: reqPayLoad.taskDescription,
    startedAt: reqPayLoad.startedAt,
    endAt: reqPayLoad.endAt,
    isCompleted: reqPayLoad.isCompleted,
    user: reqPayLoad.userObjectId,
    lastCreated: new Date(),
    lastUpdated: new Date(),
    activeStatus: true,
  });

  //send response to the user
  const createdResponse = new Created(
    true,
    "createTask",
    "created",
    "task created."
  );
  return res
    .status(createdResponse.statusCode)
    .json(createdResponse.getResponse());
};

const getAllTasks = async (req, res) => {
  //Check logged user id and find user
  if (!req?.user?.userId) {
    throw new InternalServerError(
      "createTask",
      "AuthenticationError",
      "unable to find logged user"
    );
  }
  const loggedUser = await userModel.findOne({
    userId: req.user.userId,
  });

  //Get all data related to user
  const fetchTasks = await taskModel
    .find({ user: loggedUser._id })
    .select([
      "taskId",
      "taskName",
      "taskDescription",
      "startedAt",
      "endAt",
      "isCompleted",
      "lastCreated",
    ]);

  //Preparing response
  const response = new Ok(
    true,
    "getAllTasks",
    "tasks information",
    "",
    fetchTasks
  );
  res.status(response.statusCode).json(response.getResponse());
};

const getTask = async (req, res) => {
  //Task Id
  const taskId = req.params?.id;
  if (!taskId && !Number.isInteger(taskId)) {
    throw new NotFound("getTask", "resource not found", "resource not found");
  }

  //Check logged user id
  if (!req?.user?.userId) {
    throw new InternalServerError(
      "createTask",
      "AuthenticationError",
      "unable to find logged user"
    );
  }

  //fetch the single task
  const loggedUser = await userModel.findOne({
    userId: parseInt(req.user.userId),
  });

  //get single task
  const fetchTask = await taskModel
    .findOne({
      $and: [{ user: loggedUser._id }, { taskId: taskId }],
    })
    .select([
      "taskId",
      "taskName",
      "taskDescription",
      "startedAt",
      "endAt",
      "isCompleted",
      "lastCreated",
    ]);

  if (!fetchTask) {
    throw new NotFound("getTask", "task not found", "task not found");
  }

  //Preparing a resposne
  const response = new Ok(true, "getTask", "task information", "", [
    { fetchTask },
  ]);

  res.status(response.statusCode).json({ response });
};

const updateTask = async (req, res) => {
  //Check logged user id
  if (!req?.user?.userId) {
    throw new InternalServerError(
      "createTask",
      "AuthenticationError",
      "unable to find logged user"
    );
  }

  //fetch the single task
  const loggedUser = await userModel.findOne({
    userId: parseInt(req.user.userId),
  });

  //check the task is available
  const taskId = req.params.id;
  if (!taskId && !Number.isInteger(taskId)) {
    throw new NotFound(
      "updateTask",
      "resource not found",
      "resource not found"
    );
  }

  const fetchedTask = await taskModel.findOne({
    $and: [{ user: loggedUser._id }, { taskId: taskId }],
  });
  if (!fetchedTask)
    throw new NotFound("getTask", "task not found", "task not found");

  //Update process
  //Check the  request
  const reqPayload = req.body;
  if (!reqPayload && !reqPayload.taskId == taskId) {
    throw new BadRequest(
      "updateTask",
      "ValidationError",
      "missing required properties"
    );
  }

  if (reqPayload.taskName && reqPayload.taskName.trim().length >= 0) {
    fetchedTask.taskName = reqPayload.taskName;
  }

  if (reqPayload.startedAt && reqPayload.startedAt.trim().length >= 0) {
    fetchedTask.startedAt = reqPayload.startedAt;
  }
  if (reqPayload.endAt && reqPayload.endAt.trim().length >= 0) {
    fetchedTask.endAt = reqPayload.endAt;
  }
  if (reqPayload.isCompleted) {
    fetchedTask.isCompleted = reqPayload.isCompleted;
  }

  const updatedTask = await taskModel.findOneAndUpdate(
    { _id: fetchedTask._id },
    fetchedTask,
    {
      new: true,
    }
  );

  //Preparing a response
  const response = new Ok(true, "updateTask", "task updated successfully.");
  res.status(response.statusCode).json({ response });
};

const deleteTask = async (req, res) => {
  //Check logged user id
  if (!req?.user?.userId) {
    throw new InternalServerError(
      "createTask",
      "AuthenticationError",
      "unable to find logged user"
    );
  }

  const loggedUser = await userModel.findOne({
    userId: parseInt(req.user.userId),
  });

  //fetch the single task
  //check the task is available
  const taskId = req.params.id;
  if (!taskId && !Number.isInteger(taskId)) {
    throw new NotFound(
      "updateTask",
      "resource not found",
      "resource not found"
    );
  }

  const fetchedTask = await taskModel.findOne({
    $and: [{ user: loggedUser._id }, { taskId: taskId }],
  });
  if (!fetchedTask)
    throw new NotFound("getTask", "task not found", "task not found");

  //Delete process
  const deletedTask = await taskModel.findOneAndDelete({
    _id: fetchedTask._id,
  });

  //Preparing a response
  const response = new Ok(true, "updateTask", "task updated successfully.");
  res.status(response.statusCode).json({ response });
};
module.exports = { createTask, getAllTasks, getTask, updateTask, deleteTask };
