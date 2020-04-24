import { createLogger, format, transports } from 'winston';

const { timestamp, printf, combine } = format;

const logFormat = printf(({ level, message, timestamp: curTimestamp }) => (
  `[${level.toUpperCase()}]${curTimestamp}: ${message}`
));

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/log.log' }),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
  ],
  format: combine(
    timestamp(),
    logFormat,
  ),
});

export default logger;
