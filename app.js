const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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


// Index Route (To display entire list)
app.get("/listings",  async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});


// Add Route (Form to add new stay)
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});
// (To add new stay in DB)
app.post("/listings", async(req, res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
});


// Show Route (To display specific stay)
app.get("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    const specificListing = await Listing.findById(id);
    res.render("listings/show.ejs", {specificListing});
});


// Update Route (Form to edit a stay)
app.get("/listings/:id/edit", async(req, res) =>{
    let {id} = req.params;
    const editListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {editListing});
});
// Update edited details in DB
app.put("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
    res.redirect(`/listings/${id}`);
});


// Delete Route (To delete specific stay)
app.delete("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


// Root Route
app.get("/", (req, res) =>{
    res.send("Hi! I am root");
});

//Server Connection code
app.listen(8080, () =>{
    console.log("Server listening to port 8080");
});