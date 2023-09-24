const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends Error {
  constructor(src, title, message = "", errors = []) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.src = src;
    this.title = title;
    this.errors = errors;
  }
}

module.exports = UnauthorizedError;
