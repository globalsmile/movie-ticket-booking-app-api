const express = require('express');
const connectDB = require('./src/config/db.config');
const movieRoutes = require('./routes/movies.routes');
const showtimeRoutes = require('./routes/showtimes.routes');
const bookingRoutes = require('./routes/bookings.routes');
const logger = require('./middleware/logger');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(logger);


// Connect to MongoDB
connectDB();

// Register routes
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status_code: err.status || 500,
    message: err.message || 'Internal Server Error',
    data: {}
  });
});

module.exports = app;