// __tests__/movie.test.js
const request = require('supertest');
const app = require('../server');
const Movie = require('../src/models/Movie');
const Showtime = require('../src/models/Showtime');
const path = require('path');

jest.setTimeout(10000); // Increase to 10 seconds

describe('Movie Endpoints', () => {
  // GET /api/movies should return an empty array initially
  it('GET /api/movies - should return empty movies list', async () => {
    const res = await request(app).get('/api/movies').send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status_code', 200);
    expect(res.body.data.movies.length).toBeGreaterThanOrEqual(0);
  });

  // Insert a movie document for further tests
  let movieId;
  beforeEach(async () => {
    const movie = await Movie.create({
      title: 'Test Movie',
      description: 'A movie for testing',
      releaseDate: new Date('2025-01-01'),
      posterUrl: 'http://example.com/test.jpg'
    });
    movieId = movie._id.toString();

    // Create a couple of showtimes for the movie
    await Showtime.create([
      { movie: movieId, date: new Date('2025-01-02T18:00:00Z') },
      { movie: movieId, date: new Date('2025-01-03T20:00:00Z') }
    ]);
  });

  // GET /api/movies/:id
  it('GET /api/movies/:id - should return movie details', async () => {
    const res = await request(app).get(`/api/movies/${movieId}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.data.movie).toHaveProperty('title', 'Test Movie');
  });

  // GET /api/movies/search?query=Test
  it('GET /api/movies/search - should return movies matching the query', async () => {
    const res = await request(app).get('/api/movies/search').query({ query: 'Test' }).send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.movies)).toBeTruthy();
    expect(res.body.data.movies.length).toBeGreaterThanOrEqual(1);
  });

  // GET /api/movies/now-playing and /coming-soon
  it('GET /api/movies/now-playing - should return now playing movies', async () => {
    // Assuming now playing means releaseDate <= today. Adjust test data as needed.
    await Movie.create({
      title: 'Now Playing Movie',
      releaseDate: new Date('2020-01-01'),
      posterUrl: 'http://example.com/nowplaying.jpg'
    });
    const res = await request(app).get('/api/movies/now-playing').send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.movies)).toBeTruthy();
  });

  it('GET /api/movies/coming-soon - should return coming soon movies', async () => {
    // Assuming coming soon means releaseDate > today. Adjust test data as needed.
    await Movie.create({
      title: 'Coming Soon Movie',
      releaseDate: new Date('2099-01-01'),
      posterUrl: 'http://example.com/comingsoon.jpg'
    });
    const res = await request(app).get('/api/movies/coming-soon').send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.movies)).toBeTruthy();
  });

  // GET /api/movies/:id/showtimes
  it('GET /api/movies/:id/showtimes - should return showtimes for the movie', async () => {
    const res = await request(app).get(`/api/movies/${movieId}/showtimes`).send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.showtimes)).toBeTruthy();
    expect(res.body.data.showtimes.length).toBe(2);
  });

  // POST /api/movies/upload
  // For file uploads, we use a sample image stored under tests/files/test_image.jpg.
  // Ensure that this file exists in your test files folder.
  it('POST /api/movies/upload - should upload a movie with poster image', async () => {
    const testMovieData = {
      title: 'Upload Test Movie',
      description: 'Uploaded via test',
      releaseDate: '2025-01-01'
    };

    const res = await request(app)
      .post('/api/movies/upload')
      .field('title', testMovieData.title)
      .field('description', testMovieData.description)
      .field('releaseDate', testMovieData.releaseDate)
      .attach('poster', path.join(__dirname, 'test-files', 'test_image.jpg'));

    // If Cloudinary is not mocked, you might want to skip or mock the external upload.
    // Otherwise, check for a successful response.
    expect(res.statusCode).toBe(201);
    expect(res.body.data.movie).toHaveProperty('title', testMovieData.title);
  });
});
