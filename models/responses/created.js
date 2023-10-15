const { StatusCodes } = require("http-status-codes");

/**
 * This file includes a class for output a response of when resource is created
 */
class Created {
  constructor(status, src, title, message = "", messages = []) {
    this.statusCode = StatusCodes.CREATED;
    this.status = status;
    this.src = src;
    this.title = title;
    this.message = message;
    this.messages = messages;
  }

  getResponse() {
    return {
      success: this.status,
      status: this.statusCode,
      source: this.src,
      title: this.title,
      message: this.message,
      messages: this.messages,
    };
  }
}

module.exports = Created;
