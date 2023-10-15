const userLogin = async (req, res) => {
  const reqPayLoad = req.body;

  //Check all keys are available
  const requestBodyKeys = ["userEmail", "userPassword"];
  const keysAvailable = await requestBodyKeys.every((key) =>
    reqPayLoad.hasOwnProperty(key)
  );

  if (!keysAvailable) {
    throw new BadRequest(
      "UserLogin",
      "ValidationError",
      "missing required properties"
    );
  }

  //validation of the properties
  try {
    await userLoginValidatorModel({
      userEmail: reqPayLoad.userEmail,
      userPassword: reqPayLoad.userPassword,
    });
  } catch (error) {
    throw new UnprocessableEntity(
      "UserLogin",
      "ValidationError",
      "",
      error?.details
    );
  }

  //verify the user with the database
  const verifiedUser = await userModel.findOne({
    userEmail: reqPayLoad.userEmail,
  });

  if (
    !(await verifiedUser.verifyUser(
      reqPayLoad.userEmail,
      reqPayLoad.userPassword
    ))
  ) {
    //If user is not verified
    throw new UnauthorizedError(
      "UserLogin",
      "UnauthenticatedError",
      "check user email or password."
    );
  }

  //If user is verified
  else {
    const token = await verifiedUser.createJwt();
    return res.status(StatusCodes.OK).json({
      userId: verifiedUser.userId,
      userFirstName: verifiedUser.userFirstName,
      userEmail: verifiedUser.userEmail,
      token,
    });
  }
};

module.exports = userLogin;
