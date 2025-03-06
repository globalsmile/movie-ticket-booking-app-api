// routes/bookings.routes.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const { bookingSchema } = require('../validation/schemas');
const validate = require('../middleware/validate');
const { sendBookingConfirmation } = require('../utils/mailgun');

// POST /api/bookings - create booking
router.post('/', validate(bookingSchema), async (req, res, next) => {
    try {
        const { showtimeId, userId, seatIds } = req.body;

        // Check seat availability
        const seats = await Seat.find({
            _id: { $in: seatIds },
            showtime: showtimeId,
            status: 'available'
        });

        if (seats.length !== seatIds.length) {
            return res.status(400).json({
                status_code: 400,
                message: 'One or more seats are not available',
                data: {}
            });
        }

        // Calculate total price (example: $15 per seat)
        const totalPrice = seats.length * 15;

        // Create booking
        const booking = new Booking({
            showtime: showtimeId,
            userId,
            seats: seatIds,
            totalPrice
        });
        await booking.save();

        // Mark seats as reserved
        await Seat.updateMany(
            { _id: { $in: seatIds } },
            { $set: { status: 'reserved' } }
        );

        // Send confirmation email
        sendBookingConfirmation(booking);

        res.status(201).json({
            status_code: 201,
            message: 'Booking created successfully',
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/bookings/:id - get booking details
router.get('/:id', async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            })
            .populate('seats');

        if (!booking) {
            return res.status(404).json({
                status_code: 404,
                message: 'Booking not found',
                data: {}
            });
        }

        res.status(200).json({
            status_code: 200,
            message: 'Booking details retrieved',
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;