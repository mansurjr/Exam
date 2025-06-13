const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().max(50).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(8).max(55).required(),
  phone: Joi.string().max(20).optional().allow(null, ""),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  birth_date: Joi.date().optional().allow(null),
  avatar_url: Joi.string().uri().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  gender: Joi.string().valid("male", "female").optional().allow(null),
  isSuperAdmin : Joi.boolean().optional(),
  roleIds: Joi.array().items(Joi.number().integer()).optional(),
  cardIds: Joi.array().items(Joi.number().integer()).optional(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().max(50).optional(),
  email: Joi.string().email().max(100).optional(),
  phone: Joi.string().max(20).optional().allow(null, ""),
  first_name: Joi.string().max(50).optional(),
  last_name: Joi.string().max(50).optional(),
  birth_date: Joi.date().optional().allow(null),
  avatar_url: Joi.string().uri().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  gender: Joi.string().valid("male", "female").optional().allow(null),
  isActive: Joi.boolean().optional(),
  isSuperAdmin : Joi.boolean().optional(),
  activation_link: Joi.string().optional().allow(null, ""),
  roleIds: Joi.array().items(Joi.number().integer()).optional(),
  cardIds: Joi.array().items(Joi.number().integer()).optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
