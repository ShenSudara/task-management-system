const joi = require("joi");
const joiValidator = require("../validator");

const userConfirmationSchema = joi.object({
  token: joi.string().required().length(36),
});

const userConfirmationValidatorModel = joiValidator(userConfirmationSchema);
module.exports = userConfirmationValidatorModel;
