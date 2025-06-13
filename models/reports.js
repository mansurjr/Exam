const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const TransportService = require("./transportService");
const User = require("./user");

const Report = sequelize.define(
  "report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reportDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trips_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalrevenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Report.belongsTo(TransportService);
TransportService.hasMany(Report);

Report.belongsTo(User);
User.hasMany(Report);

module.exports = Report;
