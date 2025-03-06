// __tests__/showtime.test.js
const request = require('supertest');
const app = require('../server');
const Showtime = require('../src/models/Showtime');
const Seat = require('../src/models/Seat');
const mongoose = require('mongoose');

jest.setTimeout(10000); // Increase to 10 seconds

describe('Showtime/Seat Endpoints', () => {
  let testShowtime;
  beforeEach(async () => {
    // Create a dummy showtime document
    testShowtime = await Showtime.create({
      movie: new mongoose.Types.ObjectId(),
      date: new Date('2025-01-02T18:00:00Z')
    });

    // Create some seats for this showtime
    await Seat.create([
      { showtime: testShowtime._id, row: 'A', number: 1, status: 'available' },
      { showtime: testShowtime._id, row: 'A', number: 2, status: 'available' },
      { showtime: testShowtime._id, row: 'A', number: 3, status: 'reserved' }
    ]);
  });

  // GET /api/showtimes/:showtimeId/seats
  it('GET /api/showtimes/:showtimeId/seats - should return all seats for the showtime', async () => {
    const res = await request(app).get(`/api/showtimes/${testShowtime._id}/seats`).send();
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.seats)).toBeTruthy();
    expect(res.body.data.seats.length).toBe(3);
  });
});
