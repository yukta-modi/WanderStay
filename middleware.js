const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


// To check details to be updated/added in listing
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
};

// To check details to be added in review
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
};


// To check user already logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Kindly login to proceed!");
        return res.redirect("/login");
    }
    next();
};
// To save url info from session to local 
// As everytime user login session gets reset
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// To Authorize Owner for giving permissions
module.exports.authorizeOwner = async(req, res, next) => {
    let {id} = req.params;
    let foundListing = await Listing.findById(id);
    if (!foundListing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Permission denied!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


// To Authorize author(reviewer) for deleting review
module.exports.authorizeAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let foundReview = await Review.findById(reviewId);
    if(!foundReview.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "Permission denied to delete review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};