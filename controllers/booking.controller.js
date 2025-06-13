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

const getBookingsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [results] = await sequelize.query(
      `
      SELECT ts.id, ts.vehicle_type, ts.reg_number, ts.model,
             COUNT(b.id) AS usage_count
      FROM "TransportService" ts
      JOIN "booking" b ON b."TransportServiceId" = ts.id
      WHERE b.booking_date BETWEEN :startDate AND :endDate
        AND b.status = 'confirmed'
      GROUP BY ts.id
      ORDER BY usage_count DESC
    `,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(results);
  } catch (error) {
    error_response(res);
  }
};

const getActiveClients = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const [results] = await sequelize.query(
      `
      SELECT DISTINCT u.id, u.first_name, u.last_name, u.email
      FROM "Users" u
      JOIN "UserRoles" ur ON ur."userId" = u.id
      JOIN "Roles" r ON r.id = ur."roleId" AND r.name = 'client'
      JOIN "booking" b ON b."userId" = u.id
      WHERE b.booking_date BETWEEN :startDate AND :endDate
        AND b.status = 'confirmed'
    `,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(results);
  } catch (e) {
    error_response(res);
  }
};

const getCancelledClients = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const [results] = await sequelize.query(
      `
      SELECT DISTINCT u.id, u.first_name, u.last_name, u.email
      FROM "Users" u
      JOIN "UserRoles" ur ON ur."userId" = u.id
      JOIN "Roles" r ON r.id = ur."roleId" AND r.name = 'client'
      JOIN "booking" b ON b."userId" = u.id
      WHERE b.booking_date BETWEEN :startDate AND :endDate
        AND b.status = 'cancelled'
    `,
      {
        replacements: { startDate, endDate },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (e) {
    error_response(res);
  }
};

const getClientPayments = async (req, res) => {
  const { clientId } = req.params;

  try {
    const [results] = await sequelize.query(
      `
      SELECT p.id AS payment_id,
             p.amount,
             p.payment_date,
             p.method,
             p.status AS payment_status,
             b.booking_date,
             b.status AS booking_status,
             ts.vehicle_type,
             ts.reg_number,
             ts.model,
             ts.price
      FROM "Payment" p
      JOIN "booking" b ON b.id = p."BookingId"
      JOIN "TransportService" ts ON ts.id = b."TransportServiceId"
      WHERE b."userId" = :clientId
      ORDER BY p.payment_date DESC
    `,
      {
        replacements: { clientId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(results);
  } catch (e) {
    error_response(res);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingById,
  deleteBookingById,
  getBookingsByDate,
  getActiveClients,
  getCancelledClients,
};
