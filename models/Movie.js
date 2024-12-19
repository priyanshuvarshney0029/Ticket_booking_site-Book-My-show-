const mongoose = require('mongoose');
const Review = require('./Review');

const movieSchema =new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    img: {
        type: String,
        trim: true,
        default: '/images/movie.jpg'
    },
    genre: {
        type: String,
        trim: true,
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    avgRating: {
        type: Number,
        default: 0
    },
    director: {
        type: String,
        trim: true,
        required: true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    price:{
        type:Number,
        min:0,
        required:true

    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    movies_name: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Movie'
        }
    ]
    
});
// pre and post
movieSchema.post('findOneAndDelete',async function(movie) {
    if (movie.reviews.length > 0) {
        await Review.deleteMany({_id:{$in: movie.reviews}});
    }
});

const Movie =mongoose.model('Movie',movieSchema);

module.exports=Movie;
