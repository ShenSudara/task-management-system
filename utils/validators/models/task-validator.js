const joi = require("joi");
const joiValidator = require("../validator");

const taskValidatorSchema = joi.object({
  taskName: joi
    .string()
    .required()
    .max(50)
    .min(5)
    .pattern(new RegExp("^(?!\\s*$)[a-zA-Z0-9.,()[\\]\\s]*$")),

  taskDescription: joi
    .string()
    .min(5)
    .max(2000)
    .allow(null)
    .pattern(new RegExp("^(.|\\s)*[a-zA-Z]+(.|\\s)*$")),

  startedAt: joi.date().iso().greater("now").allow(null),
  endAt: joi.date().iso().greater(joi.ref("startedAt")).allow(null),
  isCompleted: joi.boolean().required().allow(null),
});

const taskValidatorModel = joiValidator(taskValidatorSchema);
module.exports = taskValidatorModel;
