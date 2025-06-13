const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Routes = sequelize.define(
  "routes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    start_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    end_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Routes;