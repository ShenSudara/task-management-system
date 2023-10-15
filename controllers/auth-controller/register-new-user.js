const InternalServerError = require("../../errors/internal-server-error");
const UnprocessableEntity = require("../../errors/unprocessable-entity");
const Created = require("../../models/responses/created");
const userModel = require("../../models/db-models/user-model");
const userRegistrationValidatorModel = require("../../utils/validators/input-validators/models/user-registration-validator");

/**
 * this files includes a function for the registration of the user
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns
 */
const registerNewUser = async (req, res) => {
  const requestPayload = req.body;

  //validation of the properties the format and anything else are verified
  try {
    await userRegistrationValidatorModel({
      userFirstName: requestPayload.userFirstName,
      userLastName: requestPayload.userLastName,
      userEmail: requestPayload.userEmail,
      userPassword: requestPayload.userPassword,
    });
  } catch (error) {
    throw new UnprocessableEntity(
      "UserRegistration",
      "ValidationError",
      "invalid infomation",
      error?.details
    );
  }

  //check if there is any exisiting emails
  const exsistingEmail = await userModel.findOne({
    userEmail: requestPayload.userEmail,
  });
  if (exsistingEmail) {
    throw new UnprocessableEntity(
      "UserRegistration",
      "ValidationError",
      "similar email was found"
    );
  }

  //Save in the database
  const savedUser = await userModel.create({
    userFirstName: requestPayload.userFirstName,
    userLastName: requestPayload.userLastName,
    userEmail: requestPayload.userEmail,
    userPassword: requestPayload.userPassword,
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
    "user registration is successful.",
    [
      {
        token: await savedUser.createVerifyToken(),
      },
    ]
  );

  return res.status(response.statusCode).json(response.getResponse());
};

module.exports = registerNewUser;
