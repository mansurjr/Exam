const error_handler = require("../../utils/error_response");
const config = require("config");
const JWTService = require("../../service/jwt.service");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send({ message: "Token is required" });
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      return res.status(401).send({ message: "It's not bearer token" });
    }

    const service = new JWTService(config.get(`${req.baseUrl.split("/")[2]}`));
    let decoded;
    try {
      decoded = await service.verify_acces(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token has expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).send({ message: "Malformed token" });
      }
      return res.status(401).send({ message: "Invalid token" });
    }

    if (!decoded?.isActive) {
        return error_handler(res, { status: 401, message: "User is not active" })
    }

    req.decoded = decoded;
    next();
  } catch (error) {
    error_handler(res);
  }
};