// seedMovies.js
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./src/models/Movie');

const movies = [
  {
    title: "Inception",
    description: "A mind-bending thriller by Christopher Nolan where dreams become reality.",
    posterUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1621234567/inception.jpg",
    releaseDate: new Date("2010-07-16")
  },
  {
    title: "The Dark Knight",
    description: "Batman battles the Joker in this iconic superhero film that redefined the genre.",
    posterUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1621234568/dark-knight.jpg",
    releaseDate: new Date("2008-07-18")
  },
  {
    title: "Black Panther: Wakanda Forever",
    description: "Wakanda faces new challenges as the legacy of the Black Panther endures.",
    posterUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1621234569/black-panther.jpg",
    releaseDate: new Date("2022-11-11")
  },
  {
    title: "The Godfather",
    description: "A gripping tale of power and family, The Godfather defines a genre of its own.",
    posterUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1621234570/godfather.jpg",
    releaseDate: new Date("1972-03-24")
  },
  {
    title: "Interstellar",
    description: "A visually stunning journey through space and time, as humanity fights for survival.",
    posterUrl: "https://res.cloudinary.com/your-cloud-name/image/upload/v1621234571/interstellar.jpg",
    releaseDate: new Date("2014-11-07")
  }
];

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are optional in Mongoose 6+
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    // Optional: Clear existing movies
    await Movie.deleteMany({});
    console.log("Existing movies cleared");

    // Insert movies array into the database
    await Movie.insertMany(movies);
    console.log("Movies seeded successfully");
  } catch (error) {
    console.error("Error seeding movies:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedMovies();
