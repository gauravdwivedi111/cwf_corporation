import winston from 'winston';
import path from 'path';

// Custom console format for development readability
const devLogFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Save error logs specifically
    new winston.transports.File({
      filename: path.join('logs', 'errors.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB rotation
      maxFiles: 5,
    }),
    // Save all operational logs combined
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5 * 1024 * 1024, // 5MB rotation
      maxFiles: 5,
    }),
  ],
});

// Direct colorized logs to console in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        devLogFormat
      ),
    })
  );
}

export default logger;
