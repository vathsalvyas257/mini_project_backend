const express = require("express");
const router = express.Router();
const { assignRoleByEmail } = require("../controllers/adminController");
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const newsController=require("../controllers/newsController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });



// get form or model  for role assigning 
router.get("/assign-role", authenticate, authorize(["admin"]), (req, res) => {res.send("assign role(coach or organizer) form is displayed here");});

//asigning the role after submit
router.put("/assign-role", authenticate, authorize(["admin"]), assignRoleByEmail);

// adding news
router.post("/addnews", authenticate,authorize(["admin"]),upload.single("image"),newsController.addNews);

//update news 
router.put("/updatenews/:id",authenticate,authorize(["admin"]),upload.single("image"),newsController.updateNews);

//delete news
router.delete("/delnews/:id",authenticate,authorize(["admin"]),newsController.deleteNews);


module.exports = router;
