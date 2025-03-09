const express = require("express");
const router = express.Router();
const { assignRoleByEmail } = require("../controllers/adminController");
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");


// get form or model  for role assigning 
router.get("/assign-role", authenticate, authorize(["admin"]), (req, res) => {res.send("assign role(coach or organizer) form is displayed here");});

//asigning the role after submit
router.put("/assign-role", authenticate, authorize(["admin"]), assignRoleByEmail);


module.exports = router;
