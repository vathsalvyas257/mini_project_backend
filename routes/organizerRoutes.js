const express=require("express");
const router=express.Router();
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const newsController=require("../controllers/newsController");



module.exports=router;