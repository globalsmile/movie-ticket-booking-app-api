// src/middleware/logger.js
const logger = (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    }
    next();
};

module.exports = logger;
