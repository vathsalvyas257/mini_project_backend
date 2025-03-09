const express = require("express");
const router = express.Router();
const {assignOrganiserByEmail } = require("../controllers/coachController");
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");

//get assign organizer form 
router.get("/assign-organizer",authenticate,authorize(["coach"]),(req,res)=>{res.send("assign organizzer form is displayed here")});

// Only coach can assign organisers
router.put("/assign-organizer", authenticate, authorize(["coach"]), assignOrganiserByEmail);

module.exports = router;
