const joi = require("joi");
const joiValidator = require("../validator");

const userLoginValidatorSchema = joi.object({
  userEmail: joi.string().max(255).email().required(),
  userPassword: joi.string().max(12).min(4).required(),
});

const userLoginValidatorModel = joiValidator(userLoginValidatorSchema);

module.exports = userLoginValidatorModel;
