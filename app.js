const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash-plus");
const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,    // Calculated millisec for 1week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};


// Root Route
app.get("/", (req, res) =>{
    res.send("Hi! I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());    // To add user related info into session
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// Listings routes
app.use("/listings", listingRouter );
// Review routes
app.use("/listings/:id/reviews", reviewRouter);
// User routes
app.use("/", userRouter);


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