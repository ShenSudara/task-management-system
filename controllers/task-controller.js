const BadRequest = require("../errors/bad-request");
const UnprocessableEntity = require("../errors/unprocessable-entity");
const taskValidatorModel = require("../utils/validators/models/task-validator");
const userModel = require("../models/db-models/user-model");
const InternalServerError = require("../errors/internal-server-error");
const { StatusCodes } = require("http-status-codes");

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
  req.user.userObjectId = await userModel.findOne({ userId: req.user.userId });

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
  return res.status(StatusCodes.CREATED).json({ message: "Hello world" });
};

module.exports = { createTask };
