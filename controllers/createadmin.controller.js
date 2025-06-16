const User = require("../models/user");
const { errorResponse } = require("../utils/error_response");
const { createUserSchema } = require("../validation/user.validation");

const createAdmin = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return errorResponse(res, { message: error.details[0].message });
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
    value.isCreator = false;
    value.isActive = true;
    await User.create(value);
    res.status(201).json({ messege: "Admin created successfully" });
  } catch (error) {
    errorResponse(res, { error });
  }
};

module.exports = createAdmin;
