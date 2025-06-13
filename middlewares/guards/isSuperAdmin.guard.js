const { errorResponse } = require("../../utils/error_response");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const isCreator = req.decoded?.isCreator;
      const userRoles = req.decoded?.roles || [];

      const hasPermission =
        isCreator || allowedRoles.some((role) => userRoles.includes(role));

      if (!hasPermission) {
        return errorResponse(res, {
          message: "You are not allowed to do this",
          status: 403,
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