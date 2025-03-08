# Movie Ticket Booking App RESTful API

A fully functional RESTful API built with Node.js, Express, and MongoDB for managing movie listings, showtimes, seat bookings, and more. This project implements features like data validation with Joi, email notifications via Mailgun, media uploads using Cloudinary, and comprehensive testing with Jest, Supertest, and MongoDB Memory Server. The API is documented with Postman and can be deployed on platforms like Render.com.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Repository Setup and Branching](#repository-setup-and-branching)
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Third-Party Integrations](#third-party-integrations)
  - [Mailgun for Email Notifications](#mailgun-for-email-notifications)
  - [Cloudinary for Media Uploads](#cloudinary-for-media-uploads)
- [Postman Documentation](#postman-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Running the Integration Tests](#running-the-integration-tests)
- [Test Results](#test-results)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)

## Features
- **Movies Management**  
  - CRUD operations for movies (title, description, release date, poster).
  - Search movies by title, filter by "now playing" or "coming soon."

- **Showtime & Seat Management**  
  - Retrieve showtimes for each movie.
  - Retrieve seat layouts and manage seat statuses (available, reserved).

- **Booking System**  
  - Create and retrieve bookings with seat selection.
  - Email notifications sent via Mailgun after successful booking.

- **Request Validation**  
  - All data-modifying requests are validated with Joi.

- **Media Uploads**  
  - Poster images can be uploaded to Cloudinary using Multer.

- **Testing**  
  - Comprehensive tests with Jest, Supertest, and MongoDB Memory Server for isolation.

---

## Technologies Used

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas (using Mongoose)  
- **Authentication:** JWT, bcrypt  
- **Validation:** JOI  
- **Email:** Mailgun  
- **Media Upload:** Cloudinary, multer, multer-storage-cloudinary  
- **Deployment:** Render.com  
- **Documentation:** Postman

---

## Repository Setup and Branching

### Cloning and Creating a New Repository

1. **Clone the Existing Repository into a New Directory:**

```bash
   git clone <old-repo-url> movie-ticket-booking-api
   cd movie-ticket-booking-api
```

2. **Remove the Old Remote to Prevent Accidental Pushes:**

```
git remote remove origin
```

3. **Create a New Repository on GitHub and add the new remote:**

```
git remote add origin <new-repo-url>
```

**Branching Strategy**
- **Feature Branches:**
  - Develop new features on separate branches (e.g., feature/validation-joi).

- **Development Branch:**
  - Merge feature branches into a development branch for integration and testing:

```
git checkout main
git pull origin main
git checkout -b development
git push -u origin development
```

- **Main Branch:**
  - After thorough testing on development, merge changes into main:

```
git checkout main
git merge development
git push origin main
```

## **Environment Variables**
Create a .env file in the project root with the following variables:

```
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/movie-booking

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Mailgun (Email Notifications)
MAILGUN_API_KEY=your_mailgun_private_api_key
MAILGUN_DOMAIN=your_mailgun_domain
EMAIL_FROM=no-reply@yourdomain.com

# Cloudinary (Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Port
PORT=5000
```

Make sure to configure these variables in your production environment as well.

## **Setup Instructions**
- Clone the Repository & Install Dependencies:

```
git clone <new-repo-url>
cd movie-ticket-booking-api
npm install
```

- Set Up Environment Variables:
- Create a .env file (as shown above).
- Run the Application Locally:

```
npm run dev
```

The API will be available at http://localhost:5000.

## **API Endpoints**
- **Movies**
- **GET /api/movies** – Retrieve all movies.

- Example responses:
- Success: Movies Retrieved
 ```json
{
  "status_code": 200,
  "message": "Movies retrieved successfully",
  "data": {
    "movies": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Inception",
        "description": "A mind-bending thriller by Christopher Nolan.",
        "posterUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/inception.jpg",
        "releaseDate": "2010-07-16T00:00:00.000Z"
      },
      {
        "_id": "60d21b4767d0d8992e610c86",
        "title": "Interstellar",
        "description": "A visually stunning journey through space and time.",
        "posterUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/interstellar.jpg",
        "releaseDate": "2014-11-07T00:00:00.000Z"
      }
    ]
  }
```
- Failure: Internal Server Error
```json
{
  "status_code": 500,
  "message": "Internal Server Error",
  "data": {}
}
```
    
- **GET /api/movies/:id** – Get details for a specific movie.
- Example responses:
- Success: Movies Details Retrieved
 ```json
{
  "status_code": 200,
  "message": "Movie details retrieved successfully",
  "data": {
    "movie": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Inception",
      "description": "A mind-bending thriller by Christopher Nolan.",
      "posterUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/inception.jpg",
      "releaseDate": "2010-07-16T00:00:00.000Z"
    }
  }
}
```
- Failure: Movie not found
```json
{
  "status_code": 404,
  "message": "Movie not found",
  "data": {}
}
```

- **GET /api/movies/search?query=XYZ** – Search movies by title.
- Example responses:
- Success: Search results
 ```json
{
  "status_code": 200,
  "message": "Search results",
  "data": {
    "movies": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Test Movie",
        "description": "A movie for testing",
        "posterUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/test.jpg",
        "releaseDate": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```
- Failure: No search query
```json
{
  "status_code": 400,
  "message": "Search query is required",
  "data": {}
}
```

- **GET /api/movies/now-playing** – Movies currently playing.
- Example responses:
- Success: Now playing movies
 ```json
{
  "status_code": 200,
  "message": "Now playing movies",
  "data": {
    "movies": [
      {
        "_id": "60d21b4767d0d8992e610c87",
        "title": "Now Playing Movie",
        "description": "A currently showing movie.",
        "posterUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/nowplaying.jpg",
        "releaseDate": "2020-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

- **GET /api/movies/coming-soon** – Upcoming movies.
- Example responses:
- Success: Coming soon movies
 ```json
{
  "status_code": 200,
  "message": "Coming soon movies",
  "data": {
    "movies": [
      {
        "_id": "60d21b4867d0d8992e610c88",
        "title": "Coming Soon Movie",
        "description": "A movie that will be released soon.",
        "posterUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/comingsoon.jpg",
        "releaseDate": "2099-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

- **GET /api/movies/:id/showtimes** – Showtimes for a given movie.
- Example responses:
- Success: Showtimes retrieved
 ```json
{
  "status_code": 200,
  "message": "Showtimes retrieved",
  "data": {
    "showtimes": [
      {
        "_id": "60d21b4967d0d8992e610c90",
        "date": "2025-01-02T18:00:00.000Z"
      },
      {
        "_id": "60d21b4a67d0d8992e610c91",
        "date": "2025-01-03T20:00:00.000Z"
      }
    ]
  }
}
```

- **POST /api/movies/upload** – Upload a new movie with a poster image.
- Example responses:
- Success: Movie uploaded
 ```json
curl --location 'https://movie-ticket-booking-app-api.onrender.com/api/movies/upload' \
--header 'Content-Type: multipart/form-data' \
--form 'title="Test Upload Movie"' \
--form 'description="Movie uploaded via Postman"' \
--form 'releaseDate="2025-01-01"' \
--form 'poster=@"/path/to/your/test_image.jpg"'
```
- Failure: Poster missing
```json
curl --location 'https://movie-ticket-booking-app-api.onrender.com/api/movies/upload' \
--header 'Content-Type: multipart/form-data' \
--form 'title="Test Upload Movie"' \
--form 'description="Movie uploaded via Postman"' \
--form 'releaseDate="2025-01-01"'
```

- **Showtimes/Seats**
- **GET /api/showtimes/:showtimeId/seats** – Retrieve seat layout for a showtime.
- Example responses:
- Success: Seats retrieved
 ```json
{
  "status_code": 200,
  "message": "Seats retrieved",
  "data": {
    "seats": [
      {
        "_id": "60d21b4a67d0d8992e610c93",
        "row": "A",
        "number": 1,
        "status": "available"
      },
      {
        "_id": "60d21b4a67d0d8992e610c94",
        "row": "A",
        "number": 2,
        "status": "available"
      },
      {
        "_id": "60d21b4a67d0d8992e610c95",
        "row": "A",
        "number": 3,
        "status": "reserved"
      }
    ]
  }
}
```
- Failure: Showtime not found
```json
{
  "status_code": 404,
  "message": "Showtime not found",
  "data": {}
}
```

- **Bookings**
- **POST /api/bookings** – Create a new booking.
- Example responses:
- Success: Booking created
 ```json
curl --location 'https://movie-ticket-booking-app-api.onrender.com/api/bookings' \
--header 'Content-Type: application/json' \
--data-raw '{
    "showtimeId": "60d21b4967d0d8992e610c90",
    "userId": "testuser@example.com",
    "seatIds": [
        "60d21b4a67d0d8992e610c93",
        "60d21b4a67d0d8992e610c94"
    ]
}'
```
- Failure: Seats not available
```json
curl --location 'https://movie-ticket-booking-app-api.onrender.com/api/bookings' \
--header 'Content-Type: application/json' \
--data-raw '{
    "showtimeId": "60d21b4967d0d8992e610c90",
    "userId": "testuser@example.com",
    "seatIds": [
        "invalidSeatId"
    ]
}'
```

- **GET /api/bookings/:id** – Retrieve a booking by ID.
- Example responses:
- Success: Booking retrieved successfully
 ```json
{
  "status_code": 200,
  "message": "Booking retrieved successfully",
  "data": {
    "booking": {
      "_id": "60d21b4c67d0d8992e610c96",
      "userId": "testuser@example.com",
      "showtime": {
        "_id": "60d21b4967d0d8992e610c90",
        "date": "2025-01-02T18:00:00.000Z"
      },
      "seats": [
        {
          "_id": "60d21b4a67d0d8992e610c93",
          "row": "B",
          "number": 1,
          "status": "reserved"
        },
        {
          "_id": "60d21b4a67d0d8992e610c94",
          "row": "B",
          "number": 2,
          "status": "reserved"
        }
      ],
      "totalPrice": 30,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```
- Failure: Booking not found
```json
{
  "status_code": 404,
  "message": "Booking not found",
  "data": {}
}
```

Refer to the Postman Documentation for detailed request and response examples.


## **Third-Party Integrations**
### **Mailgun for Email Notifications**
  - Emails are sent using Mailgun. In production, configure Mailgun by storing your API key and domain as environment variables. The email utility (src/utils/email.js) handles sending emails for account creation, password resets, and changes.

### **Cloudinary for Media Uploads**
  - Cloudinary is configured in src/config/cloudinary.js using environment variables. Instructors can upload media files via the /api/courses/:courseId/upload endpoint. This setup uses multer and multer-storage-cloudinary for file handling.

## **Postman Documentation**
  - Import the Collection:
    - Import the provided Postman collection JSON file into Postman.

- **Publish the Documentation:**

- Open the collection in Postman.
- Click on "View Documentation" and then "Publish".
- Copy the generated public URL and include it in the README or share it with your team.


## **API Documentation**

You can view the full API documentation here: [Movie-Ticket-Booking-App API Documentation](https://documenter.getpostman.com/view/33057863/2sAYdoEmsD)


## **Deployment**
This API is deployed on Render at  https://movie-ticket-booking-app-api.onrender.com. Deployment steps include:

- Push Code to GitHub:
  - Ensure all changes are committed and pushed to the new GitHub repository.

- Configure Render.com:
  - Connect the repository.

- Set environment variables (as shown above) in Render’s dashboard.
- Deploy the application.
- Update Postman Base URL:
- In your Postman collection, update the {{baseUrl}} variable to the production URL provided by Render.

## **Troubleshooting**
- 502 Bad Gateway Errors:
  - Check server logs and ensure that environment variables (MongoDB URI, JWT secret, etc.) are correctly configured. Verify that the application is listening on the correct port.

- 500 Internal Server Errors on Upload:
  - Verify Cloudinary configuration, file size limits, and allowed formats. Wrap your upload route in a try-catch block to log detailed error messages.

- Mailgun Errors:
  - Ensure that the "to" field is populated with a valid email address and that your Mailgun credentials are correct.

- JWT or JOI Validation Issues:
  - Confirm that your JWT secret is consistently used across signing and verification. Review JOI schemas for correctness.

## **Running the Integration Tests**

To run the integration tests for the Advanced E-Learning Platform RESTful API, execute the following command from the root of the project:

```bash
npm test
```

## **Test Results**

```
PASS __tests__/movie.test.js (5.334 s)
  Movie Endpoints
    ✓ should retrieve all movies (300 ms)
    ✓ should upload a movie with a poster (1200 ms)
    ✓ should return 404 for non-existent movie (150 ms)
    ✓ should search movies successfully (200 ms)

PASS __tests__/showtime.test.js (2.134 s)
  Showtime Endpoints
    ✓ should retrieve seats for a showtime (300 ms)

PASS __tests__/booking.test.js (5.001 s)
  Booking Endpoints
    ✓ should create a new booking (450 ms)
    ✓ should retrieve a booking by id (210 ms)
    ✓ should return 400 for unavailable seats (120 ms)
    ✓ should return 404 for non-existent booking (100 ms)
    ✓ should verify totalPrice is calculated correctly (130 ms)

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        12.5 s, estimated 14 s
Ran all test suites.
```


## **Lessons Learned**
- Repository Management:
  - Creating a new repository and using a dedicated development branch helped streamline the development process and prevent accidental pushes.

- Validation & Security:
  - Implementing JOI for request validation and using JWT for authentication ensured that data integrity and security were maintained.

- Third-Party Integrations:
  - Integrating Mailgun and Cloudinary provided valuable experience in managing external services securely in production.

- Deployment Best Practices:
  - Properly configuring environment variables and using a continuous deployment platform like Render.com streamlined the production rollout process.

## **Conclusion**
The Movie Ticket Booking App RESTful API is a robust solution for managing movies, showtimes, seat bookings, and more. By leveraging modern web development practices—including data validation, external service integrations, and comprehensive testing—the API is scalable, maintainable, and production-ready.
