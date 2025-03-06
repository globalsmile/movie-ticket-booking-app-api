// models/Movie.js
const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  posterUrl: { type: String },   // e.g. link to an image
  releaseDate: { type: Date },
  // Possibly more fields, like genre, rating, cast, etc.
  // For "Now Playing", "Coming Soon", "Top Movies", you could have extra flags or computed properties
});

module.exports = mongoose.model('Movie', MovieSchema);
