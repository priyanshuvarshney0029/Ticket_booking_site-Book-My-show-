const Movie = require("./models/Movie");
const reviewSchema = require('./models/Review');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to access this route');
        return res.redirect('/login');
    }
    next();
}; 
const validateReview = (req,res,next)=>{
    const {rating,comment} = req.body;
    const {error} = reviewSchema.validate({rating,comment})
    if(error){
        return res.render('error');
    }
    next();
}
const isAdmin=(req,res,next)=>{
    if(!req.user.role){
        req.flash('error','you donot have the permission to do that')
        return res.redirect('/movies')
    }
    else if(req.user.role !=='admin'){
        req.flash('error',"you donot have the permission to do that")
        return res.redirect('/movies')
    }
    next();
}

const isProductAuthor=async(req,res,next)=>{
    let {id}=req.params;
    let movie=await Movie.findById(id)
    if(!movie.author.equals(req.user._id)){
        req.flash('error','You are not the authrised user')
        return res.redirect('/movies')
    }
    next();
}
module.exports={isLoggedIn,isAdmin,isProductAuthor,validateReview};