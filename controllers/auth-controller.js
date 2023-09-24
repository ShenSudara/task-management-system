const { StatusCodes } = require("http-status-codes");
const userRegistrationValidatorModel = require("../utils/validators/models/user-registration-validator");
const BadRequest = require("../errors/bad-request");
const UnprocessableEntity = require("../errors/unprocessable-entity");
const userModel = require("../models/db-models/user-model");
const InternalServerError = require("../errors/internal-server-error");
const Created = require("../models/responses/created");
const userLoginValidatorModel = require("../utils/validators/models/user-login-validator");
const UnauthorizedError = require("../errors/unauthorized-error");

const registerNewUser = async (req, res) => {
  const reqPayLoad = req.body;

  const requestBodyKeys = [
    "userFirstName",
    "userLastName",
    "userEmail",
    "userPassword",
  ];

  //Check the all keys are available
  const keysAvailable = await requestBodyKeys.every((key) =>
    reqPayLoad.hasOwnProperty(key)
  );

  if (!keysAvailable) {
    throw new BadRequest(
      "UserRegistration",
      "ValidationError",
      "Missing Required Properties"
    );
  }

  //validation of the properties
  //Check format errors
  try {
    await userRegistrationValidatorModel({
      userFirstName: reqPayLoad.userFirstName,
      userLastName: reqPayLoad.userLastName,
      userEmail: reqPayLoad.userEmail,
      userPassword: reqPayLoad.userPassword,
    });
  } catch (error) {
    throw new UnprocessableEntity(
      "UserRegistration",
      "ValidationError",
      "",
      error?.details
    );
  }

  //Save in the database
  const savedUser = await userModel.create({
    userFirstName: reqPayLoad.userFirstName,
    userLastName: reqPayLoad.userLastName,
    userEmail: reqPayLoad.userEmail,
    userPassword: reqPayLoad.userPassword,
  });

  if (!savedUser)
    throw new InternalServerError(
      "UserRegistration",
      "unable to create a user."
    );

  const response = new Created(
    true,
    "UserRegistration",
    "successful",
    "user registration is successful."
  );

  return res.status(response.statusCode).json(response.getResponse());
};

const login = async (req, res) => {
  const reqPayLoad = req.body;

  //Check all keys are available
  const requestBodyKeys = ["userEmail", "userPassword"];
  const keysAvailable = await requestBodyKeys.every((key) =>
    reqPayLoad.hasOwnProperty(key)
  );

  if (!keysAvailable) {
    throw new BadRequest(
      "UserLogin",
      "ValidationError",
      "Missing Required Properties"
    );
  }

  //validation of the properties
  try {
    await userLoginValidatorModel({
      userEmail: reqPayLoad.userEmail,
      userPassword: reqPayLoad.userPassword,
    });
  } catch (error) {
    throw new UnprocessableEntity(
      "UserLogin",
      "ValidationError",
      "",
      error?.details
    );
  }

  //verify the user with the database
  const verifiedUser = await userModel.findOne({
    userEmail: reqPayLoad.userEmail,
  });

  if (
    !(await verifiedUser.verifyUser(
      reqPayLoad.userEmail,
      reqPayLoad.userPassword
    ))
  ) {
    //If user is not verified
    throw new UnauthorizedError(
      "UserLogin",
      "UnauthenticatedError",
      "check user email or password."
    );
  }

  //If user is verified
  else {
    const token = await verifiedUser.createJwt();
    return res.status(StatusCodes.OK).json({
      userId: verifiedUser.userId,
      userFirstName: verifiedUser.userFirstName,
      userEmail: verifiedUser.userEmail,
      token,
    });
  }
};
module.exports = { registerNewUser, login };
