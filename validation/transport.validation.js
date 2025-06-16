const Joi = require("joi");

const createTransportServiceSchema = Joi.object({
  vehicle_type: Joi.string().max(50).required(),
  price: Joi.number().precision(2).min(0).required(),
  available_seats: Joi.number().integer().min(1).required(),
  reg_number: Joi.string().max(50).optional().allow(null, ""),
  model: Joi.string().max(50).optional().allow(null, ""),
  status: Joi.string().valid("active", "maintenance", "occupied").optional(),
  routeId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
});

const updateTransportServiceSchema = Joi.object({
  vehicle_type: Joi.string().max(50).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  available_seats: Joi.number().integer().min(1).optional(),
  reg_number: Joi.string().max(50).optional().allow(null, ""),
  model: Joi.string().max(50).optional().allow(null, ""),
  status: Joi.string().valid("active", "maintenance", "occupied").optional(),
  userId: Joi.number().integer().optional(),
  routeId: Joi.number().integer().optional(),
});

module.exports = {
  createTransportServiceSchema,
  updateTransportServiceSchema,
};
