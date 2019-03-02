import * as appRoot from "app-root-path";
import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");

/**
 * Winston Logging Levels:
 *
 * 0: error
 * 1: warn
 * 2: info
 * 3: verbose
 * 4: debug
 * 5: silly
 *
 */

const logFormat = winston.format.json();

const infoWarnFilter = winston.format((info, opts) => {
  return info.level === "info" || info.level === "warn" ? info : false;
});

const errorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const options = {
  infoLog: {
    name: "Info Logs",
    filename: `${appRoot}/logs/info.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "10m",
    maxFiles: "1d",
    level: "info",
    json: true,
    colorize: false,
    format: winston.format.combine(
      infoWarnFilter(),
      winston.format.timestamp(),
      logFormat
    )
  },
  errorLog: {
    name: "Error Logs",
    filename: `${appRoot}/logs/error.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "10m",
    maxFiles: "1d",
    level: "warn",
    json: true,
    colorize: false,
    format: winston.format.combine(
      errorFilter(),
      winston.format.splat(),
      winston.format.simple(),
      logFormat
    )
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: true,
    colorize: true
  }
};

const transports = [
  new DailyRotateFile(options.infoLog),
  new DailyRotateFile(options.errorLog),
  new winston.transports.Console(options.console)
];

// Log unhandled exceptions to separate file
const exceptionHandlers = [
  new DailyRotateFile({
    filename: `${appRoot}/logs/exceptions.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "10m",
    maxFiles: "1d"
  })
];

// instantiate the logger with custom options above.
const winstonLogger = winston.createLogger({
  transports,
  exceptionHandlers,
  exitOnError: false,
  // Default format
  format: winston.format.combine(winston.format.timestamp(), logFormat)
});

export { winstonLogger };
