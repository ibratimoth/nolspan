const winston = require('winston');
require('winston-daily-rotate-file');
const { DateTime } = require('luxon');
const path = require('path');

// Create log file path
const logDir = path.join(__dirname, 'logs');

// Define custom log format
const logFormat = winston.format.printf(({ level, message }) => {
    const timestamp = DateTime.now().setZone('Africa/Dar_es_Salaam').toISO();
    return `[${timestamp}] ${message}`;  // Format without level
});

// Configure log rotation
const transport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, 'rigelWeb-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Compress old logs
    maxSize: '20m', // Max log file size before rotating
    maxFiles: '30d', // Keep logs for 30 days
});

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(logFormat), // Apply the format
    transports: [
        transport, // Log to files with rotation
        new winston.transports.Console({ format: logFormat }) // Log to console
    ]
});

// Export logger so it can be used in other files
module.exports = logger;