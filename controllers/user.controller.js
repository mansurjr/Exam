const { errorResponse } = require("../utils/error_response");
const User = require("../models/user");
const uuid = require("uuid");
const { sendActivationEmail } = require("../service/email.service");
const Card = require("../models/card");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validation/user.validation");
const { Op } = require("sequelize");

const getAllUsers = (role) => {
  return async (_, res) => {
    try {
      const users = await User.findAll({
        where: role ? { role } : undefined,
        include: [
          Card,
          ...(role === "driver"
            ? [
                {
                  model: Transport,
                },
              ]
            : []),
        ],
      });

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      const sanitizedUsers = users.map((user) => {
        const plainUser = user.get({ plain: true });
        if (plainUser.role === "admin") {
          delete plainUser.cards;
        }
        return plainUser;
      });

      return res.status(200).json({ data: sanitizedUsers });
    } catch (error) {
      errorResponse(res, { error });
    }
  };
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { include: Card });

    if (!user) {
      return errorResponse(res, {
        message: "User not found",
        status: 404,
        error: "User not found",
      });
    }

    res.status(200).send({ data: user });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const createUser = async (req, res) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      console.log(error);
      return errorResponse(res, "Validation error", {
        message: error.details[0].message,
        status: 400,
        error: error,
      });
    }

    const activation_link = uuid.v4();
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: value.email }, { username: value.username }],
      },
    });
    if (existingUser) {
      return errorResponse(res, "User already exists", {
        message: "User already exists",
        status: 400,
      });
    }
    const newUser = await User.create({ ...value, activation_link });

    await sendActivationEmail(newUser.email, activation_link);

    res.status(201).send({
      message:
        "User created successfully. Please check your email to activate your account.",
    });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, { message: "User not found", status: 404 });
    }

    const { error, value } = updateUserSchema(req.body);
    if (error) {
      return errorResponse(res, {
        message: error.details[0].message,
        status: 400,
        error,
      });
    }

    const [updatedCount, [updatedUser]] = await User.update(value, {
      where: { id },
      returning: true,
    });

    if (!updatedCount) {
      return errorResponse(res, {
        message: "User update failed",
        status: 400,
        error: "User update failed",
      });
    }

    res.status(200).send({ message: "User updated", data: updatedUser });
  } catch (error) {
    errorResponse(res, { error });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return errorResponse(res, { message: "User not found", status: 404 });
    }

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    errorResponse(res, { message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
