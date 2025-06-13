const error_handler = require("../../utils/error_response");

module.exports = (req, res, next) => {
  try {
    if (req.params.id != req.decoded.id) {
      return error_handler(res, {
        status: 401,
        messege: "You are not allowed to do it!",
      });
    }
    next();
  } catch (error) {
    error_handler(res);
  }
};
