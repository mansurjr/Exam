const Joi = require("joi");

const createCardSchema = Joi.object({
  serial_number: Joi.string().required(),
  exp_date: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .message('Expiration date must be in MM/YY format')
    .required(),
  desc: Joi.string().max(20).optional().allow(null, ""),
  userId: Joi.number().integer().required(),
});

const updateCardSchema = Joi.object({
  serial_number: Joi.string().optional(),
  exp_date: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .message('Expiration date must be in MM/YY format')
    .optional(),
  desc: Joi.string().max(20).optional().allow(null, ""),
  userId: Joi.number().integer().optional(),
});

module.exports = {
  createCardSchema,
  updateCardSchema,
};
