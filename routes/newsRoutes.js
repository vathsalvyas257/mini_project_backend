const express=require("express");
const router=express.Router();
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const newsController=require("../controllers/newsController");
const {upload}=require("../config/cloudinary");

//view all news 
router.get("/view",newsController.viewNews);

//organizer and admin can create news 
router.post("/addnews", authenticate,authorize(["organizer","admin"]),upload.single("image"),newsController.addNews);

//delete news
router.delete("/delnews/:id",authenticate,authorize(["organizer","admin"]),newsController.deleteNews);

//update news 
router.put("/updatenews/:id",authenticate,authorize(["organizer","admin"]),upload.single("image"),newsController.updateNews);

module.exports=router;