const User = require("../models/user");
const { errorResponse } = require("../utils/error_response");
const { createUserSchema } = require("../validation/user.validation");

exports.createSuperAdmin = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return errorResponse(res, { messege: error.details[0].message });
    }
    await User.create(value);
    res.status(201).json({ messege: "Created successfully" });
  } catch (error) {
    errorResponse(res);
  }
};