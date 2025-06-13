const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, json, colorize } =
  format;
require("winston-mongodb");
const config = require("config");

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  exitOnError: false,
  format: combine(label({ label: "IT TERM" }), timestamp(), myFormat),
  transports: [
    new transports.Console({
      level: "debug",
      format: combine(colorize()),
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: combine(json()),
    }),
    new transports.File({ filename: "combined.log" }),
    new transports.MongoDB({
      db: config.get("uri"),
      collection: "log",
      options: { useUnifiedTopology: true },
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
  rejectionHandlers: [
    new transports.File({ filename: "rejections.log" }),
    new transports.MongoDB({
      db: config.get("uri"),
      collection: "rejections",
      options: { useUnifiedTopology: true },
    }),
  ],
});

module.exports = logger;