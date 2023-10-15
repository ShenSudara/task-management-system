const joi = require("joi");
const joiValidator = require("../validator");

/**
 * this files includes a joi validation rules for validating the properties of when users are registering
 */

const userRegistrationValidatorSchema = joi.object({
  userFirstName: joi
    .string()
    .max(25)
    .min(2)
    .pattern(new RegExp("[a-z ,.'-]+$"))
    .required(),
  userLastName: joi
    .string()
    .max(25)
    .min(2)
    .pattern(new RegExp("[a-z ,.'-]+$"))
    .required(),
  userEmail: joi.string().max(255).email().required(),
  userPassword: joi.string().max(12).min(4).required(),
});

const userRegistrationValidatorModel = joiValidator(
  userRegistrationValidatorSchema
);

module.exports = userRegistrationValidatorModel;
