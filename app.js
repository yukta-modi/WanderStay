const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate); 

const mongoURL = "mongodb://127.0.0.1:27017/wanderstay";
main().then(() =>{
    console.log("Connection Successful");
}).catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongoURL);
}

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
};


// Root Route
app.get("/", (req, res) =>{
    res.send("Hi! I am root");
});


// Index Route (To display entire list)
app.get("/listings",  wrapAsync(async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// Add Route (Form to add new stay)
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});
// (To add new stay in DB)
app.post("/listings", validateListing, wrapAsync(async(req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// Show Route (To display specific stay)
app.get("/listings/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    const specificListing = await Listing.findById(id);
    res.render("listings/show.ejs", {specificListing});
}));


// Update Route (Form to edit a stay)
app.get("/listings/:id/edit", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    const editListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {editListing});
}));
// Update edited details in DB
app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
    let {id} = m/req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
    res.redirect(`/listings/${id}`);
}));


// Delete Route (To delete specific stay)
app.delete("/listings/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


app.use((req, res, next) =>{
    next(new ExpressError(404, "Page not found!"));
    
});

// Error Handling Middleware
app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

//Server Connection code
app.listen(8080, () =>{
    console.log("Server listening to port 8080");
});