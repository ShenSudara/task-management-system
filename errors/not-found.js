const { StatusCodes } = require("http-status-codes");

class NotFound extends Error {
  constructor(src, title, message = "", errors = []) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.src = src;
    this.title = title;
    this.errors = errors;
  }
}

module.exports = NotFound;
