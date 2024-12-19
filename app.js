require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const express = require('express');
const app = express();

const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const movieRoutes = require('./routes/movie');
const reviewRoutes = require('./routes/review');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const checkRoutes=require('./routes/checkout')

// Connect Mongodb
mongoose.connect('mongodb://127.0.0.1:27017/Showtym') 
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

// Session configuration
const sessionConfig={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 24 * 7 * 60 * 60 * 1000,
        maxAge: 24 * 7 * 60 * 60 * 1000 
    }
};

// Set up view engine and static folder
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});

// Routes
app.use(movieRoutes);
app.use(authRoutes); 
app.use(reviewRoutes);
app.use(checkRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
