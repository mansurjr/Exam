const path = require("path");
const winston = require("winston");
const expressWinston = require("express-winston");

const fs = require("fs");
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
  filename: path.join(logDir, "http.log"),
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json()
  ),
});

module.exports = expressWinston.logger({
  transports: [
    consoleTransport,
    fileTransport,
  ],
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
  expressFormat: true,
  colorize: false,
  ignoreRoute: () => false,
});