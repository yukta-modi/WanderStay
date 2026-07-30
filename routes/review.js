const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, authorizeAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");


// Review Route (To add review for specific stay)
router.post("/", isLoggedIn, validateReview, 
    wrapAsync(reviewController.addReview)
);


// Delete Review Route (To delete specific review)
router.delete("/:reviewId", isLoggedIn, authorizeAuthor,
    wrapAsync(reviewController.deleteReview)
);
 

module.exports = router;