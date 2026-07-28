const mongoose = require("mongoose");
const review = require("./review");
const Review = require("./review.js")
//const { schema } = require("../schema");

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: String, 
    image: {
        type: String,
        // image is not send
        default: "https://unsplash.com/photos/a-hotel-with-a-swimming-pool-and-chairs-UzCG00U5Wqc",
        // image is sent but its empty
        set: (v) => 
            v === "" ? 
            "https://unsplash.com/photos/a-hotel-with-a-swimming-pool-and-chairs-UzCG00U5Wqc"
            : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

// Post Middleware
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;