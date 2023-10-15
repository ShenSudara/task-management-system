const express = require("express");
const registerNewUser = require("../controllers/auth-controller/register-new-user");
const userLogin = require("../controllers/auth-controller/user-login");
const newUserRequestValidator = require("../middlewares/validations/auth/new-user-validator");
const userConfirmation = require("../controllers/auth-controller/user-confirmation");
const authRouter = express.Router();

/**
 * This file includes the routes of authorization
 * Register of new user
 * confirmation of the new user
 * login for the new user
 */
authRouter.route("/register").post(newUserRequestValidator, registerNewUser);
authRouter.route("/confirm").get(userConfirmation);
authRouter.route("/login").post(userLogin);

module.exports = authRouter;
