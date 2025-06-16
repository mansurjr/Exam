// routes/booking.routes.js

const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingById,
  deleteBookingById,
  getCancelledClients,
  getActiveClients,
  getBookingsByDate,
} = require("../controllers/booking.controller");

const roleChecker = require("../middlewares/guards/isPermittedRole.guard");
const tokenGuard = require("../middlewares/guards/token.guard");

router.get("/", tokenGuard, getAllBookings);
router.post("/", tokenGuard, createBooking);
router.get("/services", tokenGuard, roleChecker("admin"), getBookingsByDate);
router.get("/clients", tokenGuard, roleChecker("admin"), getActiveClients);
router.get("/cancelled", tokenGuard, roleChecker("admin"), getCancelledClients);
router.get("/:id", tokenGuard, getBookingById);
router.put("/:id", tokenGuard, updateBookingById);
router.delete("/:id", tokenGuard, roleChecker("admin"), deleteBookingById);

module.exports = router;
