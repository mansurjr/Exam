const error_response = require("../utils/error_response");
const Payment = require("../models/payment");
const Booking = require("../models/booking");

const {
  createPaymentSchema,
  updatePaymentSchema,
} = require("../validation/payment.validation");

const getAllPayments = async (_, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          attributes: ["id", "booking_date", "seat_number", "status"],
        },
      ],
    });

    if (!payments.length) {
      return error_response(res, {
        message: "Payments not found",
        status: 404,
      });
    }

    res.status(200).send({ data: payments });
  } catch (error) {
    error_response(res, error);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking,
          attributes: ["id", "booking_date", "seat_number", "status"],
        },
      ],
    });

    if (!payment) {
      return error_response(res, {
        message: "Payment not found",
        status: 404,
      });
    }

    res.status(200).send({ data: payment });
  } catch (error) {
    error_response(res, error);
  }
};

const createPayment = async (req, res) => {
  try {
    const { error, value } = createPaymentSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }

    const newPayment = await Payment.create(value);
    res.status(201).send({ message: "Payment created", data: newPayment });
  } catch (error) {
    error_response(res, error);
  }
};

const updatePaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return error_response(res, {
        message: "Payment not found",
        status: 404,
      });
    }

    const { error, value } = updatePaymentSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }

    const [count, updated] = await Payment.update(value, {
      where: { id },
      returning: true,
    });

    if (!count) {
      return error_response(res, { message: "Failed to update payment" });
    }

    res.status(200).send({ message: "Payment updated", data: updated[0] });
  } catch (error) {
    error_response(res, error);
  }
};

const deletePaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Payment.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, { message: "Payment not found" });
    }

    res.status(200).send({ message: "Payment deleted successfully" });
  } catch (error) {
    error_response(res, error);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentById,
  deletePaymentById,
};
