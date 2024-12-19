const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const movies = [
    {
        title: "Inception",
        img: "https://images.unsplash.com/photo-1529661202753-e8e60b36e32b",
        genre: "Science Fiction",
        releaseYear: 2010,
        description: "A skilled thief is given a chance to have his criminal history erased if he can infiltrate the subconscious of his targets.",
        avgRating: 8.8,
        director: "Christopher Nolan"
    },
    {
        title: "The Godfather",
        img: "https://images.unsplash.com/photo-1561760264-0380b7464f1c",
        genre: "Crime",
        releaseYear: 1972,
        description: "An organized crime dynasty's aging patriarch transfers control of his clandestine empire to his reluctant son.",
        avgRating: 9.2,
        director: "Francis Ford Coppola"
    },
    {
        title: "The Dark Knight",
        img: "https://images.unsplash.com/photo-1546953534-3f6f7a6f22c1",
        genre: "Action",
        releaseYear: 2008,
        description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
        avgRating: 9.0,
        director: "Christopher Nolan"
    },
    {
        title: "Pulp Fiction",
        img: "https://images.unsplash.com/photo-1516728778615-2d4d62f11f4f",
        genre: "Crime",
        releaseYear: 1994,
        description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        avgRating: 8.9,
        director: "Quentin Tarantino"
    },
    {
        title: "The Shawshank Redemption",
        img: "https://images.unsplash.com/photo-1525556015476-23b8a2035ff9",
        genre: "Drama",
        releaseYear: 1994,
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        avgRating: 9.3,
        director: "Frank Darabont"
    }
];

async function seedDB() {
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log("Movies seeded successfully");
}

module.exports = seedDB;
