require("express-async-errors");
const express = require("express");
const userRouter = require("./routers/user-router");
const errorHandler = require("./middlewares/errors/error-handler");
const authentication = require("./middlewares/auth/authentication");
const authRouter = require("./routers/auth-router");
const taskRouter = require("./routers/task-router");
const app = express();

/**
 * entry point of the application
 */

//Middlewares of the application
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authentication, userRouter);
app.use("/api/v1/tasks", authentication, taskRouter);

//Error Handler
app.use(errorHandler);

module.exports = app;
