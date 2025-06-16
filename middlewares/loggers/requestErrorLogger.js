const winston = require("winston");
const expressWinston = require("express-winston");
const fs = require("fs");
const path = require("node:path");

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const fileTransport = new winston.transports.File({
  filename: path.join(logDir, "RequestError.log"),
  level: "error",
});

module.exports = expressWinston.errorLogger({
  transports: [consoleTransport, fileTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});
