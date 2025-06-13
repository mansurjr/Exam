const error_response = require("../utils/error_response");
const User = require("../models/user");
const uuid = require("uuid");
const mailService = require("../service/email.service");
const Role = require("../models/role");
const Card = require("../models/card");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validation/user.validation");

const getAllUsers = (role) => {
  return async (_, res) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Role,
            where: role ? { name: role } : undefined,
            through: { attributes: [] },
          },
          {
            model: Card,
            attributes: ["serial_number", "exp_date", "desc"],
          },
        ],
      });

      if (!users.length) {
        return error_response(res, {
          message: "Users not found",
          status: 404,
        });
      }

      res.status(200).send({ data: users });
    } catch (error) {
      error_response(res, {
        message: error.message,
        status: 500,
      });
    }
  };
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
        {
          model: Card,
          attributes: ["serial_number", "exp_date", "desc"],
        },
      ],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ data: user });
  } catch (error) {
    error_response(res);
  }
};

const createUser = async (req, res) => {
  try {
    if (req.decoded.isCreator === false) {
      delete req.body.isCreator;
    }
    const { error, value } = createUserSchema(req.body);
    if (error) {
      return error_response(res, { messege: error.details[0].message });
    }
    const newUser = User.create(value);
    const link = uuid.v4();
    await mailService.sendMail(newUser.email, link);
    res.status(201).send({
      message:
        "User created successfully, Please check your email to activate your account",
    });
  } catch (error) {
    error_handler(res);
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return error_response(res, { message: "User not found" });
    }
    const { error, value } = updateUserSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }
    const updated = await User.update(value, {
      where: { id },
      returning: true,
    });

    if (!updated[0]) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User updated", data: updated[1][0] });
  } catch (error) {
    error_response(res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, { message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    error_response(res);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
