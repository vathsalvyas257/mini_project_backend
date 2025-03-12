const express=require("express");
const router=express.Router();
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const newsController=require("../controllers/newsController");
const multer=require("multer");
const storage=multer.memoryStorage();
const upload=multer({storage});


//organizer can create news 
router.post("/addnews", authenticate,authorize(["organizer"]),upload.single("image"),newsController.addNews);

//delete news
router.delete("/delnews/:id",authenticate,authorize(["organizer"]),newsController.deleteNews);

//update news 
router.put("/updatenews/:id",authenticate,authorize(["organizer"]),upload.single("image"),newsController.updateNews);

module.exports=router;