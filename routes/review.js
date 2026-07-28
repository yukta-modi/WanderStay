const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, authorizeAuthor } = require("../middleware.js");


// Review Route (To add review to specific stay)
router.post("/", isLoggedIn, validateReview, 
    wrapAsync(async(req, res) => {
        let reviewListing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        newReview.author = req.user._id;
        reviewListing.reviews.push(newReview);
        
        await newReview.save();
        await reviewListing.save();
        req.flash("success", "New review added..");
        res.redirect(`/listings/${reviewListing._id}`);
    })
);


// Delete Review Route (To delete specific review)
router.delete("/:reviewId", isLoggedIn, authorizeAuthor,
    wrapAsync(async(req, res) =>{
        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted..");
        res.redirect(`/listings/${id}`);
    })
);
 

module.exports = router;