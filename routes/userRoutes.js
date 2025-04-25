const express = require("express");
const router = express.Router();
const authenticate=require("../middlewares/authMiddleware");
const {upload}=require("../config/cloudinary");
const userController=require("../controllers/userController")

// Get user profile
router.get("/details",authenticate, userController.getUserDetails);


// Update user profile
router.put("/update", authenticate, upload.single("profileImage"), userController.updateUserDetails);


router.get("/all", authenticate, userController.getAllUsers);


module.exports = router;
