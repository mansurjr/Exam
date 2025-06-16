const { errorResponse } = require("../../utils/error_response");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const isCreator = req.decoded.isCreator;
      const role = req.decoded.role || "";

      const hasPermission = isCreator || allowedRoles.includes(role) || allowedRoles === role;

      if (!hasPermission) {
        return errorResponse(res, {
          message: "You are not allowed to do this",
          status: 403,
          error: "You are not allowed to do this",
        });
      }

      next();
    } catch (error) {
      return errorResponse(res, {
        message: "Authorization check failed",
        status: 500,
        error,
      });
    }
  };
};
