const Listing = require("../models/listing");

// Index Route Callback
module.exports.indexAllListing = async(req, res) =>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
};


// Add Route(Form) Callback
module.exports.addForm = (req, res) =>{
    res.render("listings/new.ejs");
};
// Create New Listing callback
module.exports.createNewListing = async(req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Staycation added to listing..");
    res.redirect("/listings");
};


// Show Route callback(To display specific stay)
module.exports.showListing = async(req, res) =>{
    let {id} = req.params;
    const specificListing = await Listing.findById(id)
        .populate({path: "reviews", populate:{path: "author"}})
        .populate("owner");
    if(!specificListing){
        req.flash("error", "Staycation requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {specificListing});
};


// Edit Route(Form) Callback
module.exports.editForm = async(req, res) =>{
    let {id} = req.params;
    const editListing = await Listing.findById(id);
    if(!editListing){
        req.flash("error", "Staycation requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {editListing});
};
//
module.exports.editListing = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
    req.flash("success", "Staycation details updated..");
    res.redirect(`/listings/${id}`);
};


//
module.exports.deleteListing = async(req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Staycation deleted from listing..");
    res.redirect("/listings");
};