import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const dailyRotateFileOptions = {
  maxSize: "25m",
  maxFiles: "14d",
  zippedArchive: true,
  extension: ".log",
};

export const phoneLogger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.align(),
    format.printf(({ level, timestamp, message }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/phone-info.%DATE%",
      level: "info",
      ...dailyRotateFileOptions,
    }),
    new DailyRotateFile({
      filename: "logs/phone-verbose.%DATE%",
      level: "verbose",
      ...dailyRotateFileOptions,
    }),
    new transports.Console({
      level: "info",
    }),
  ],
});


export const discordLogger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.align(),
    format.printf(({ level, timestamp, message }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/discord-info.%DATE%",
      level: "info",
      ...dailyRotateFileOptions,
    }),
    new DailyRotateFile({
      filename: "logs/discord-debug.%DATE%",
      level: "debug",
      ...dailyRotateFileOptions,
    }),
    new transports.Console({
      level: "warn",
    }),
  ],
});
