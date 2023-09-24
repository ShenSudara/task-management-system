const { StatusCodes } = require("http-status-codes");

class Ok {
  constructor(status, src, title, message = "", data = []) {
    this.statusCode = StatusCodes.OK;
    this.status = status;
    this.src = src;
    this.title = title;
    this.message = message;
    this.data = data;
  }

  getResponse() {
    return {
      success: this.status,
      status: this.statusCode,
      source: this.src,
      title: this.title,
      message: this.message,
      data: this.data,
    };
  }
}

module.exports = Ok;
