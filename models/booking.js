const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user");
const TransportService = require("./transportService");

const Booking = sequelize.define(
  "booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    booking_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    seat_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "Booking",
    timestamps: true,
  }
);

Booking.belongsTo(User);
User.hasMany(Booking);

TransportService.hasMany(Booking);
Booking.belongsTo(TransportService);

module.exports = Booking;