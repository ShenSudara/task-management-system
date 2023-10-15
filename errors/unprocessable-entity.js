const { StatusCodes } = require("http-status-codes");

/**
 * This file includes a class for output a response of unprocessable entity error
 */

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
