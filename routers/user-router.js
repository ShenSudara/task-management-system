const express = require("express");
const { getUser } = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.route("/me").get(getUser);

module.exports = userRouter;
