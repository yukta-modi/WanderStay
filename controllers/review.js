const Review = require("../models/review");
const Listing = require("../models/listing");


// Review Route callback
module.exports.addReview = async(req, res) => {
    let reviewListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    reviewListing.reviews.push(newReview);

    await newReview.save();
    await reviewListing.save();
    req.flash("success", "New review added..");
    res.redirect(`/listings/${reviewListing._id}`);
};


// Delete Route callback 
module.exports.deleteReview = async(req, res) =>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted..");
    res.redirect(`/listings/${id}`);
};