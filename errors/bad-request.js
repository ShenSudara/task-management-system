const { StatusCodes } = require("http-status-codes");

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
