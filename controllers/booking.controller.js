const error_response = require("../utils/error_response");
const Booking = require("../models/booking");
const User = require("../models/user");
const TransportService = require("../models/transportService");
const {
  createBookingSchema,
  updateBookingSchema,
} = require("../validation/booking.validation");

const getAllBookings = async (_, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email"],
        },
        {
          model: TransportService,
          attributes: ["id", "vehicle_type", "reg_number", "price"],
        },
      ],
    });

    if (!bookings.length) {
      return error_response(res, {
        message: "No bookings found",
        status: 404,
      });
    }

    res.status(200).send({ data: bookings });
  } catch (error) {
    error_response(res, error);
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email"],
        },
        {
          model: TransportService,
          attributes: ["id", "vehicle_type", "reg_number", "price"],
        },
      ],
    });

    if (!booking) {
      return error_response(res, {
        message: "Booking not found",
        status: 404,
      });
    }

    res.status(200).send({ data: booking });
  } catch (error) {
    error_response(res, error);
  }
};

const createBooking = async (req, res) => {
  try {
    const { error, value } = createBookingSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }

    const newBooking = await Booking.create(value);
    res.status(201).send({ message: "Booking created", data: newBooking });
  } catch (error) {
    error_response(res, error);
  }
};

const updateBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return error_response(res, {
        message: "Booking not found",
        status: 404,
      });
    }

    const { error, value } = updateBookingSchema(req.body);
    if (error) {
      return error_response(res, { message: error.details[0].message });
    }

    const [count, updated] = await Booking.update(value, {
      where: { id },
      returning: true,
    });

    if (!count) {
      return res.status(404).send({ message: "Booking not found" });
    }

    res.status(200).send({ message: "Booking updated", data: updated[0] });
  } catch (error) {
    error_response(res, error);
  }
};

const deleteBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Booking.destroy({ where: { id } });
    if (!deleted) {
      return error_response(res, { message: "Booking not found" });
    }

    res.status(200).send({ message: "Booking deleted successfully" });
  } catch (error) {
    error_response(res, error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingById,
  deleteBookingById,
};
