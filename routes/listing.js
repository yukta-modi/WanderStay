const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, authorizeOwner, validateListing} = require("../middleware.js");
const listing = require("../models/listing.js");
const { validate } = require("../models/user.js");



// Index Route (To display entire list)
router.get("/",  wrapAsync(async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// Add Route (Form to add new stay)
router.get("/new", isLoggedIn, (req, res) =>{
    res.render("listings/new.ejs");
});
// (To add new stay in DB)
router.post("/", isLoggedIn, validate, 
    wrapAsync(async(req, res, next) =>{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Staycation added to listing..");
        res.redirect("/listings");
    })
);


// Show Route (To display specific stay)
router.get("/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    const specificListing = await Listing.findById(id)
            .populate({path: "reviews", populate:{path: "author"}})
            .populate("owner");
    if(!specificListing){
        req.flash("error", "Staycation requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {specificListing});
}));


// Edit Route (Form to edit a stay)
router.get("/:id/edit", isLoggedIn, authorizeOwner,
    wrapAsync(async(req, res) =>{
        let {id} = req.params;
        const editListing = await Listing.findById(id);
        if(!editListing){
            req.flash("error", "Staycation requested does not exist!");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", {editListing});
    })
);
// Update edited details in DB
router.put("/:id", isLoggedIn, authorizeOwner, validateListing, 
    wrapAsync(async(req, res) => {
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
        req.flash("success", "Staycation details updated..");
        res.redirect(`/listings/${id}`);
    })
);


// Delete Route (To delete specific stay)
router.delete("/:id", isLoggedIn, authorizeOwner,
    wrapAsync(async(req, res) =>{
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Staycation deleted from listing..");
        res.redirect("/listings");
    })
);


module.exports = router;