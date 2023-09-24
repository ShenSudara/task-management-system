const { StatusCodes } = require("http-status-codes");
const userModel = require("../models/db-models/user-model");
const InternalServerError = require("../errors/internal-server-error");
const Ok = require("../models/responses/ok");

const getUser = async (req, res) => {
  const userPayLoad = req.user;

  //find a logged user
  if (!userPayLoad.userId) {
    throw new InternalServerError(
      "getUser",
      "UserNotAvailable",
      "user is not available"
    );
  }
  const loggedUser = await userModel.findOne({ userId: userPayLoad.userId });
  if (!loggedUser) {
    throw new InternalServerError(
      "getUser",
      "UserNotAvailable",
      "user is not available"
    );
  }
  console.log(loggedUser);

  //Prepare data
  const response = new Ok(true, "getUser", "User Infomation", "", [
    {
      _id: loggedUser._id,
      userId: loggedUser.userId,
      userFirstName: loggedUser.userFirstName,
      userLastName: loggedUser.userLastName,
      userEmail: loggedUser.userEmail,
      joinOn: new Date(loggedUser.lastCreated),
    },
  ]);
  res.status(response.statusCode).json(response.getResponse());
};

module.exports = { getUser };
