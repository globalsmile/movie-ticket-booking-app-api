// models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  userId: { type: String, required: true }, // or reference a User model if you have user auth
  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true
    }
  ],
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
  // You might also store a barcode or QR code reference here
});

module.exports = mongoose.model('Booking', BookingSchema);
