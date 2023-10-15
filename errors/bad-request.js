const { StatusCodes } = require("http-status-codes");

/**
 * this file includes a class for output a response of bad request error
 */

class BadRequest extends Error {
  constructor(src, title, message = "", errors = []) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.src = src;
    this.title = title;
    this.errors = errors;
  }
}

module.exports = BadRequest;
