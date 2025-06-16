const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Card = sequelize.define(
  "card",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    exp_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Card;