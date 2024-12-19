const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();
const {isLoggedIn,isAdmin,isProductAuthor} = require('../middleware');

// all movies
router.get('/',(req,res)=>{
    res.render('movies/home')
})

router.get('/movies', isLoggedIn, async (req, res) => {
    try {
        let movies = await Movie.find({}); // data seed dumy data
        res.render('movies/index', { movies });
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

// new movie
router.get('/movie/new', isLoggedIn, (req, res) => {
    try {
        res.render('movies/new');
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

//add movies
router.post('/movies', isLoggedIn, isAdmin, async (req,res) => {
    try {
        let {title, img, genre, releaseYear, description, director,price } = req.body;
        await Movie.create({title, img, genre, releaseYear, description,price, director,author:req.user._id }); // explicity
        req.flash('success', 'movie added successfully');
        res.redirect('/movies');
    } catch (e) {
        res.status(500).render('error', {err:e.message});
    }
});

// show movie
router.get('/movies/:id', isLoggedIn, async(req,res) => {
    try {
        let { id } = req.params;
        let foundProduct = await Movie.findById(id).populate("reviews");
        res.render('movies/show', { foundProduct });
    } catch (e) {
        res.status(500).render('error', {err:e.message });
    }
});

// edit
router.get('/movies/edit/:id', isLoggedIn,isProductAuthor, async(req, res) => {
    try {
        let { id } = req.params;
        let foundProduct = await Movie.findById(id);
        res.render('movies/edit', {foundProduct});
    } 
    catch (e) {
        res.status(500).render('error', {err:e.message});
    }
});

// Route to update movie details in the database
router.patch('/movies/:id', isLoggedIn, async(req, res) => {
    try {
        const {id} = req.params;
        const {title, img, genre, releaseYear, description, avgRating, director,price}=req.body;

        // Update movie data
        await Movie.findByIdAndUpdate(id, {
            title,
            img,
            genre,
            releaseYear,
            description,
            avgRating,
            director,
            price
        });
        req.flash('success','Movie edited successfully');
        res.redirect(`/movies/${id}`); // paritcular show route hit 
    } 
    catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

// to delete a movie
router.delete('/movies/:id', isLoggedIn, isProductAuthor, async (req, res) => {
    try {
        let {id}=req.params;
        await Movie.findByIdAndDelete(id);
        req.flash('success', 'movie deleted successfully');
        res.redirect('/movies');
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

router.get('/search', async (req, res) => {
    const {search} = req.query;
    if(!search){
        return res.render('movies/searchResults',{movies:[]})
    }
    const movies = await Movie.find({ title:{$regex:search,$options:'i'}});
    res.render('movies/searchResults', { movies });
  });

  // book-tickets
router.get('/book-ticket/:id', async (req, res) => {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    res.render('movies/bookTicket', {movie});
});

//bookin
const Booking = require('../models/Booking');

router.post('/book-ticket/:id', async (req, res) => {
    const movieId = req.params.id;
    const {name,age,state,date} = req.body;

    try {
        const movie = await Movie.findById(movieId);
        const price = movie.price;
        const newBooking = new Booking({
            movieId,
            name,
            age,
            state,
            date,
        });
        await newBooking.save();
        res.render('movies/ticketBooked', {
            movieId,
            name,
            price,
        });
    } 
    catch (error) {
        console.error('Error booking ticket:', error);
        res.send('Error booking ticket');
    }
});

module.exports = router;
