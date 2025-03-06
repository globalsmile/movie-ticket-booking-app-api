// models/Seat.js
const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  row: { type: String, required: true },    // e.g. "A", "B", "1", "2"
  number: { type: Number, required: true }, // seat number in that row
  status: {
    type: String,
    enum: ['available', 'reserved'],
    default: 'available'
  },
  // Possibly store seat type, e.g. "VIP", "Standard", etc.
});

module.exports = mongoose.model('Seat', SeatSchema);
