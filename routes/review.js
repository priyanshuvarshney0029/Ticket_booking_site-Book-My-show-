const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const {validateReview} = require('../middleware');

router.post('/movies/:movieid/review', validateReview, async (req, res) => {
    try {
        const {movieid} = req.params;
        const {rating,comment} = req.body;
        const movie = await Movie.findById(movieid);
        const review = new Review({rating,comment });

        // Average Rating Logic
        const newAverageRating = ((movie.avgRating * movie.reviews.length) + parseInt(rating)) / (movie.reviews.length + 1);
        movie.avgRating = parseFloat(newAverageRating.toFixed(1)); // update kr rhe h rating

        movie.reviews.push(review);
        await review.save();
        await movie.save();
        req.flash('success', 'Added your review successfully!');
        res.redirect(`/movies/${movieid}`);
    } 
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

module.exports = router;
