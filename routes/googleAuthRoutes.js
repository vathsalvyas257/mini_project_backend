const express = require("express");
const passport = require("../config/passport");
const { googleAuthSuccess, logout } = require("../controllers/googleAuthController");
const router = express.Router();
const authController=require("../controllers/authController")

//  Start Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//  Google OAuth callback (handled in controller)
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthSuccess);

module.exports = router;
