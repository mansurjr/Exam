const Joi = require("joi");

const createCardSchema = Joi.object({
  serial_number: Joi.string().required(),
  exp_date: Joi.date().required(),
  desc: Joi.string().max(20).optional().allow(null, ""),
  userId: Joi.number().integer().required(),
});

const updateCardSchema = Joi.object({
  serial_number: Joi.string().optional(),
  exp_date: Joi.date().optional(),
  desc: Joi.string().max(20).optional().allow(null, ""),
  userId: Joi.number().integer().optional(),
});

module.exports = {
  createCardSchema,
  updateCardSchema,
};
