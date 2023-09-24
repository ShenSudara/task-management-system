const { StatusCodes } = require("http-status-codes");

class UnprocessableEntity extends Error {
  constructor(src, title, message = "", errors = []) {
    super(message);
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    this.src = src;
    this.title = title;
    this.errors = errors;
  }
}

module.exports = UnprocessableEntity;
