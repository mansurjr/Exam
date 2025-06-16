const Joi = require("joi");

const createUserSchema = Joi.object({
  username: Joi.string().max(50).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(8).max(55).required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required(),
  phone: Joi.string().max(20).optional().allow(null, ""),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).required(),
  birth_date: Joi.date().optional().allow(null),
  avatar_url: Joi.string().uri().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  gender: Joi.string().valid("male", "female").optional().allow(null),
  role: Joi.string()
    .valid("admin", "client", "driver")
    .optional()
    .default("client"),
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
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
