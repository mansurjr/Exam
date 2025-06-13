const config = require("config");
const { Sequelize } = require("sequelize");

const { database, username, password } = config.get("db");
const host = config.get("DB_HOST");
const port = config.get("DB_PORT");

const sequelize = new Sequelize(database, username, password, {
  dialect: "postgres",
  host,
  port,
  logging: false,
});

module.exports = sequelize;