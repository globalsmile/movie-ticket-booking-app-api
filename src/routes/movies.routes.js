// routes/movies.routes.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const multer = require('multer');
const { movieSchema } = require('../validation/schemas');
const validate = require('../middleware/validate');
const cloudinary = require('../utils/cloudinary');

const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.'), false);
    }
};

const storage = multer.diskStorage({}); // Files will be stored in memory
const upload = multer({ storage, fileFilter });

// GET /api/movies
// Returns all movies. You could add filters or queries for "now playing", "coming soon", etc.
router.get('/', async (req, res, next) => {
    try {
        const movies = await Movie.find();
        return res.status(200).json({
            status_code: 200,
            message: 'Movies retrieved successfully',
            data: { movies }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/search?query=Doctor
router.get('/search', async (req, res, next) => {
    try {
        const query = req.query.query || '';
        // Simple case-insensitive title search
        const movies = await Movie.find({ title: { $regex: query, $options: 'i' } });
        return res.status(200).json({
            status_code: 200,
            message: 'Search results',
            data: { movies }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/now-playing
router.get('/now-playing', async (req, res, next) => {
    try {
        const today = new Date();
        // Suppose "Now Playing" means releaseDate <= today
        const movies = await Movie.find({ releaseDate: { $lte: today } });
        return res.status(200).json({
            status_code: 200,
            message: 'Now playing movies',
            data: { movies }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/coming-soon
router.get('/coming-soon', async (req, res, next) => {
    try {
        const today = new Date();
        // Suppose "Coming Soon" means releaseDate > today
        const movies = await Movie.find({ releaseDate: { $gt: today } });
        return res.status(200).json({
            status_code: 200,
            message: 'Coming soon movies',
            data: { movies }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/:id
router.get('/:id', async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({
                status_code: 404,
                message: 'Movie not found',
                data: {}
            });
        }
        return res.status(200).json({
            status_code: 200,
            message: 'Movie details',
            data: { movie }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/movies/:id/showtimes
router.get('/:id/showtimes', async (req, res, next) => {
    try {
        const showtimes = await Showtime.find({ movie: req.params.id });
        return res.status(200).json({
            status_code: 200,
            message: 'Showtimes retrieved',
            data: { showtimes }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/movies/upload
router.post('/upload', upload.single('poster'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status_code: 400,
                message: 'Poster file is required',
                data: {}
            });
        }
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'movie_posters',
            allowed_formats: ['jpeg', 'jpg', 'png', 'gif']
        });

        // Validate other fields along with Cloudinary URL
        const { error, value } = movieSchema.validate({
            ...req.body,
            posterUrl: result.secure_url
        });
        if (error) {
            return res.status(400).json({
                status_code: 400,
                message: error.details[0].message,
                data: {}
            });
        }

        // Create movie in database
        const movie = new Movie(value);
        await movie.save();

        res.status(201).json({
            status_code: 201,
            message: 'Movie uploaded successfully',
            data: { movie }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;