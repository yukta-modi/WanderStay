const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, authorizeOwner, validateListing} = require("../middleware.js");
const listing = require("../models/listing.js");
const listingController = require("../controllers/listing.js");


router.route("/")
// Index Route (To display entire staycation list)
    .get(wrapAsync(listingController.indexAllListing))
// Add Route (To add new stay in DB)
    .post(isLoggedIn, validateListing, 
        wrapAsync(listingController.createNewListing)
    );


// Add Route (Form to add new stay)
router.get("/new", isLoggedIn, listingController.addForm);


router.route("/:id")
// Show Route (To display specific stay)
    .get(wrapAsync(listingController.showListing))
// Edit Route (Update edited details in DB)
    .put(isLoggedIn, authorizeOwner, validateListing, 
        wrapAsync(listingController.editListing)
    )
// Delete Route (To delete specific stay)
    .delete(isLoggedIn, authorizeOwner,
        wrapAsync(listingController.deleteListing)
    );


// Edit Route (Form to edit a stay)
router.get("/:id/edit", isLoggedIn, authorizeOwner,
    wrapAsync(listingController.editForm)
);


module.exports = router;