const express = require("express");
const { registerNewUser, login } = require("../controllers/auth-controller");
const authRouter = express.Router();

authRouter.route("/register").post(registerNewUser);
authRouter.route("/login").post(login);

module.exports = authRouter;
