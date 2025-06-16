const UserRoutes = require("./user.routes");
const AdminRoutes = require("./admin.routes");
const TransportRoutes = require("./transportService.routes");
const BookingRoutes = require("./booking.routes");
const PaymentRoutes = require("./payment.routes");
const ReportRoutes = require("./report.routes");
const CardRoutes = require("./card.routes");
const TransportrouteRoutes = require("./TransportRoutes.routes")
const IndexRoter = require("express").Router();

IndexRoter.use("/user", UserRoutes);
IndexRoter.use("/admin", AdminRoutes);
IndexRoter.use("/transport", TransportRoutes);
IndexRoter.use("/booking", BookingRoutes);
IndexRoter.use("/payment", PaymentRoutes);
IndexRoter.use("/report", ReportRoutes);
IndexRoter.use("/card", CardRoutes);
IndexRoter.use("/route", TransportrouteRoutes);

module.exports = IndexRoter;
