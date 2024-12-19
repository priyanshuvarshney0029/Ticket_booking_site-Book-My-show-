const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

router.post('/checkout', async (req, res) => {
    const { movieId, name, price } = req.body;

    try {
        // Validate movie and price
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Create a Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: movie.title,
                            description: movie.description,
                        },
                        unit_amount: price * 100, // Stripe expects amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/movies`,
        });

        // Redirect to the Stripe checkout page
        res.redirect(303, session.url);
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).send('Something went wrong while processing payment.');
    }
});

router.get('/success', async (req, res) => {
    const sessionId = req.query.session_id;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Extract relevant details
        const { customer_details } = session;

        // Render a success page
        res.render('movies/paymentSuccess', {
            name: customer_details.name,
            email: customer_details.email,
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).send('Payment confirmation failed.');
    }
});

module.exports = router;
