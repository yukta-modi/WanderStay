const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


// Register  Route
router.route("/signup")
// (Form to register new user)
    .get( userController.signupForm)
// (To register new user in DB)
    .post(wrapAsync(userController.signupUser));


// Login  Route 
router.route("/login")
// (Form to login user)
    .get(userController.loginForm)
// (To authenticate & then login user)
    .post(saveRedirectUrl, 
        passport.authenticate("local", 
            {failureRedirect: "/login", failureFlash: true}
        ), 
        userController.loginUser
    );


// Logout  Route (To logout user)
router.get("/logout", userController.logoutUser);


module.exports = router;