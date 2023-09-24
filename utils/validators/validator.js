const joiValidator = (schema) => async (requestPayload) => {
  return await schema.validateAsync(requestPayload, { abortEarly: false });
};

module.exports = joiValidator;
