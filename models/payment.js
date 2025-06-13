const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Booking = require("./booking");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    method: {
      type: DataTypes.ENUM("card", "cash", "online"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
  }
);

Payment.belongsTo(Booking);
Booking.hasMany(Payment);

module.exports = Payment;
