const Joi = require("joi");

const createBookingSchema = Joi.object({
  booking_date: Joi.date().optional().default(new Date()),
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),
  seat_number: Joi.string().max(10).optional().allow(null, ""),
  userId: Joi.number().integer().required(),
  TransportServiceId: Joi.number().integer().required(),
});

const updateBookingSchema = Joi.object({
  booking_date: Joi.date().optional(),
  status: Joi.string().valid("pending", "confirmed", "cancelled").optional(),
  seat_number: Joi.string().max(10).optional().allow(null, ""),
  userId: Joi.number().integer().optional(),
  TransportServiceId: Joi.number().integer().optional(),
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
};