const UnauthorizedError = require("../errors/unauthorized-error");
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader && !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "UserAuthorization",
      "Unauthorized",
      "unauthorized access"
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payLoad.userId, userEmail: payLoad.userEmail };
  } catch (error) {
    throw new UnauthorizedError(
      "UserAuthorization",
      "Unauthorized",
      "unauthorized access"
    );
  }
  next();
};

module.exports = authentication;
