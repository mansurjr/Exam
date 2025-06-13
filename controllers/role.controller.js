const Role = require("../models/role");
const error_response = require("../utils/error_response");

const getAllRoles = async (_, res) => {
  try {
    const roles = await Role.findAll();
    if (!roles.length) {
      return error_response(res, {
        message: "No roles found",
        status: 404,
      });
    }

    res.status(200).send({ data: roles });
  } catch (error) {
    error_response(res, error);
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return error_response(res, {
        message: "Role not found",
        status: 404,
      });
    }

    res.status(200).send({ data: role });
  } catch (error) {
    error_response(res, error);
  }
};

const createRole = async (req, res) => {
  try {
    const { name, desc } = req.body;

    const exists = await Role.findOne({ where: { name } });
    if (exists) {
      return error_response(res, {
        message: "Role already exists",
        status: 409,
      });
    }

    const newRole = await Role.create({ name, desc });
    res.status(201).send({ message: "Role created", data: newRole });
  } catch (error) {
    error_response(res, error);
  }
};

const updateRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return error_response(res, {
        message: "Role not found",
        status: 404,
      });
    }

    const { name, desc } = req.body;
    await role.update({ name, desc });

    res.status(200).send({ message: "Role updated", data: role });
  } catch (error) {
    error_response(res, error);
  }
};

const deleteRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Role.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, {
        message: "Role not found",
        status: 404,
      });
    }

    res.status(200).send({ message: "Role deleted successfully" });
  } catch (error) {
    error_response(res, error);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRoleById,
  deleteRoleById,
};
