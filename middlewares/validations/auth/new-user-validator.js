const BadRequest = require("../../../errors/bad-request");
const validateRequest = require("../../../utils/validators/request-validators/request-validator");

/**
 *
 * This files including a function for the validating of incoming requests for the user registration
 *
 * @param {Object} req incoming request object to middleware
 * @param {Object} res outgoing response object to the next middlware
 * @param {Function} next next function is called to the next middleware of the application
 */
const newUserRequestValidator = async (req, res, next) => {
  const requestPayload = req.body;
  const requestValidated = await validateRequest(
    ["userFirstName", "userLastName", "userEmail", "userPassword"],
    requestPayload
  );

  if (requestValidated) next();
  else
    throw new BadRequest(
      "UserRegistration",
      "ValidationError",
      "undable to process the request"
    );
};

module.exports = newUserRequestValidator;
