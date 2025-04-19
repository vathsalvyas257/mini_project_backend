const express = require("express");
const router = express.Router();
const authController=require("../controllers/authController.js");
const authMiddleware =require("../middlewares/authMiddleware.js")

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout",authController.logout);
router.get("/me", authMiddleware, (req, res) => {
  // If token is valid and user is authenticated, send the user data
  // console.log("entered into the api/auth/me",req.user);
  res.status(200).json({ user: req.user });
});



module.exports = router;