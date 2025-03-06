const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const { bookingSchema } = require('../validation/schemas');
const validate = require('../middleware/validate');
const { sendBookingConfirmation } = require('../utils/mailgun');

// POST /api/bookings - Create a booking
router.post('/', validate(bookingSchema), async (req, res, next) => {
  try {
    const { showtimeId, userId, seatIds } = req.body;
    
    // Check that all seats are available for the given showtime
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
    
    // Calculate total price (for example, $15 per seat)
    const totalPrice = seats.length * 15;
    
    // Create the booking document
    const booking = new Booking({
      showtime: showtimeId,
      userId,
      seats: seatIds,
      totalPrice
    });
    
    await booking.save();
    
    // Update the seats' status to 'reserved'
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: 'reserved' } }
    );
    
    // Send a confirmation email (if implemented)
    sendBookingConfirmation(booking);
    
    return res.status(201).json({
      status_code: 201,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({
      status_code: 500,
      message: 'Internal server error during booking creation',
      data: {}
    });
  }
});

// GET /api/bookings/:id - Retrieve a booking by ID
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
    
    return res.status(200).json({
      status_code: 200,
      message: 'Booking retrieved successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({
      status_code: 500,
      message: 'Internal server error retrieving booking',
      data: {}
    });
  }
});

module.exports = router;
