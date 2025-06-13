const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Routes = require("./route.model");

const TransportService = sequelize.define(
  "TransportService",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    available_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reg_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "maintenance", "occupied"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "TransportService",
    timestamps: true,
  }
);

TransportService.belongsTo(Routes)
Routes.hasMany(TransportService)

module.exports = TransportService;
