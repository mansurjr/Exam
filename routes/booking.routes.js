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
const isSuperAdminGuard = require("../middlewares/guards/isSuperAdmin.guard");

router.get("/",isSuperAdminGuard(["admin"]), getAllBookings);
router.get("/:id", getBookingById);
router.get("/services", getBookingsByDate);
router.get("/clients", getActiveClients);
router.get("/cancelled", getCancelledClients);
router.post("/", createBooking);
router.put("/:id", updateBookingById);
router.delete("/:id", deleteBookingById);

module.exports = router;
