const error_handler = require("../../utils/error_response");

module.exports = (req, res, next) => {
  try {
    if (req.params.id != req.decoded.id && req.decoded.role != "admin") {
      return error_handler.errorResponse(res, {
        status: 401,
        message: "You are not allowed to do it!",
        error: "You are not allowed to do it!",
      });
    }
    next();
  } catch (error) {
    error_handler.errorResponse(res, { error });
  }
};