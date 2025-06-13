const Joi = require("joi");

const createPaymentSchema = Joi.object({
  amount: Joi.number().precision(2).required(),
  payment_date: Joi.date().optional(),
  method: Joi.string().valid("card", "cash", "online").required(),
  status: Joi.string().valid("pending", "completed", "failed").default("pending"),
  bookingId: Joi.number().integer().required(),
});

const updatePaymentSchema = Joi.object({
  amount: Joi.number().precision(2).optional(),
  payment_date: Joi.date().optional(),
  method: Joi.string().valid("card", "cash", "online").optional(),
  status: Joi.string().valid("pending", "completed", "failed").optional(),
  bookingId: Joi.number().integer().optional(),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
