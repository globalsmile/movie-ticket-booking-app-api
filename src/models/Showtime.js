// models/Showtime.js
const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  date: { type: Date, required: true },  // e.g. "April 23, 2022 18:00"
  // Could also store a simpler time reference if needed
  // e.g. showtime: "6 p.m." as a string
  // Or store seat pricing info
});

module.exports = mongoose.model('Showtime', ShowtimeSchema);
