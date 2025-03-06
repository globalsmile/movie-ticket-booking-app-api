// routes/showtimes.routes.js
const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');
const Seat = require('../models/Seat');

// GET /api/showtimes/:showtimeId/seats
router.get('/:showtimeId/seats', async (req, res, next) => {
    try {
        const seats = await Seat.find({ showtime: req.params.showtimeId });
        return res.status(200).json({
            status_code: 200,
            message: 'Seats retrieved',
            data: { seats }
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;