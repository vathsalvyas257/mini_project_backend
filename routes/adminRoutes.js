const express = require("express");
const router = express.Router();
const { assignRoleByEmail } = require("../controllers/adminController");
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const newsController=require("../controllers/newsController");


//asigning the role after submit
router.put("/assign-role", authenticate, authorize(["admin"]), assignRoleByEmail);



module.exports = router;
