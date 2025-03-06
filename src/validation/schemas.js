// src/validation/schemas.js
const Joi = require('joi');

// For movie creation (including Cloudinary upload)
const movieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  releaseDate: Joi.date().required(),
  // posterUrl will be provided after file upload to Cloudinary
  posterUrl: Joi.string().uri().optional()
});

// For booking creation
const bookingSchema = Joi.object({
  showtimeId: Joi.string().required(),
  userId: Joi.string().email().required(), // assuming userId is the email here
  seatIds: Joi.array().items(Joi.string()).min(1).required()
});

module.exports = {
  movieSchema,
  bookingSchema
};
