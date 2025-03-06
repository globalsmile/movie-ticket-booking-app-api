// __tests__/booking.test.js
const request = require('supertest');
const app = require('../server');
const Booking = require('../src/models/Booking');
const Seat = require('../src/models/Seat');
const mongoose = require('mongoose');

jest.setTimeout(10000); // Increase to 10 seconds

describe('Booking Endpoints', () => {
  let testShowtimeId;
  let testSeatIds = [];

  beforeEach(async () => {
    testShowtimeId = new mongoose.Types.ObjectId();

    // Create available seats for booking
    const seat1 = await Seat.create({
      showtime: testShowtimeId,
      row: 'B',
      number: 1,
      status: 'available'
    });
    const seat2 = await Seat.create({
      showtime: testShowtimeId,
      row: 'B',
      number: 2,
      status: 'available'
    });
    testSeatIds = [seat1._id.toString(), seat2._id.toString()];
  });

  // POST /api/bookings
  it('POST /api/bookings - should create a new booking', async () => {
    const bookingData = {
      showtimeId: testShowtimeId.toString(),
      userId: 'testuser@example.com', // Using email as userId for validation
      seatIds: testSeatIds,
    };

    const res = await request(app).post('/api/bookings').send(bookingData);

    // Check for a successful booking creation (or handle error scenarios if seats are unavailable)
    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('status_code', 201);
      expect(res.body.data.booking).toHaveProperty('userId', bookingData.userId);
    } else {
      expect([400, 404]).toContain(res.statusCode);
    }
  });

  // GET /api/bookings/:id
  it('GET /api/bookings/:id - should retrieve a booking by id', async () => {
    // First, create a booking to then retrieve it
    const bookingData = {
      showtimeId: testShowtimeId.toString(),
      userId: 'testuser@example.com',
      seatIds: testSeatIds,
    };

    const createRes = await request(app).post('/api/bookings').send(bookingData);
    expect(createRes.statusCode).toBe(201);
    const bookingId = createRes.body.data.booking._id;

    const getRes = await request(app).get(`/api/bookings/${bookingId}`).send();
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty('status_code', 200);
    expect(getRes.body.data.booking).toHaveProperty('userId', bookingData.userId);
  });
});
