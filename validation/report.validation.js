const Joi = require("joi");

const createReportSchema = Joi.object({
  reportDate: Joi.date().required(),
  trips_count: Joi.number().integer().min(0).required(),
  totalrevenue: Joi.number().precision(2).min(0).required(),
  TransportServiceId: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
});

const updateReportSchema = Joi.object({
  reportDate: Joi.date().optional(),
  trips_count: Joi.number().integer().min(0).optional(),
  totalrevenue: Joi.number().precision(2).min(0).optional(),
  TransportServiceId: Joi.number().integer().optional(),
  userId: Joi.number().integer().optional(),
});

module.exports = {
  createReportSchema,
  updateReportSchema,
};