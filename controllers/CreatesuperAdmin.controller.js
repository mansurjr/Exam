const User = require("../models/user");
const { errorResponse } = require("../utils/error_response");
const { createUserSchema } = require("../validation/user.validation");

const createSuperAdmin = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return errorResponse(res, {
        message: error.details[0].message,
        status: 400,
        error: error.details[0].message,
      });
    }
    const user = await User.findOne({
      where: { email: value.email, username: value.username },
    });
    if (user) {
      return errorResponse(res, {
        message: "Admin already exists",
        status: 400,
        error: "Admin already exists",
      });
    }
    value.role = "admin";
    value.isCreator = true;
    value.isActive = true;
    await User.create(value);
    res.status(201).json({ messege: "Created successfully" });
  } catch (error) {
    errorResponse(res, { error });
  }
};

module.exports = createSuperAdmin;
