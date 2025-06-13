const Joi = require("joi");

const createRoleSchema = Joi.object({
  name: Joi.string().max(255).required(),
  desc: Joi.string().allow(null, "").optional(),
});

const updateRoleSchema = Joi.object({
  name: Joi.string().max(255).optional(),
  desc: Joi.string().allow(null, "").optional(),
});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
};