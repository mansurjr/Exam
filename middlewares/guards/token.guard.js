const { Admin, User } = require("../../service/jwt.service");
const error_handler = require("../../utils/error_response");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({ message: "Token is required" });
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Invalid Bearer token format" });
    }

    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    const isAdmin = decodedToken.role === "admin";
    const service = isAdmin ? Admin : User;

    let verifiedPayload;
    try {
      verifiedPayload = await service.verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token has expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).send({ message: "Malformed token" });
      }
      return res.status(401).send({ message: "Invalid token 2" });
    }

    if (!verifiedPayload?.isActive) {
      return error_handler.errorResponse(res, {
        status: 401,
        message: "Your account is not activated",
        error: "Your account is not activated",
      });
    }

    req.decoded = verifiedPayload;
    next();
  } catch (error) {
    return error_handler.errorResponse(res, {
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
