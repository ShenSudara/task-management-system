const { StatusCodes } = require("http-status-codes");

/**
 * This file includes a class for output a response of internal server errors
 */

class InternalServerError extends Error {
  constructor(src, title, message = "", errors = []) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.src = src;
    this.title = title;
    this.errors = errors;
  }
}

module.exports = InternalServerError;
