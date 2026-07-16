const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");


// Register  Route (Form to register new user)
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// (To register new user in DB)
router.post("/signup", wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const registeredUser = new User({email, username});
        const regUser = await User.register(registeredUser, password);
        console.log(regUser);
        req.flash("success", "Welcome to WanderStay!");
        res.redirect("/listings");
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

module.exports = router;