const mongoose = require("mongoose");

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
    country: String
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;