const express=require("express");
const router=express.Router();
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const tournamentController=require("../controllers/tournamentController");
const multer=require("multer");
const storage=multer.memoryStorage();
const upload=multer({storage});

//create tournament
router.post("/create",authenticate,authorize(["admin","organizer"]),upload.single("image"),tournamentController.createTournament)

// view all tournaments
router.get("/view",tournamentController.getAllTournaments);

//view tournament by id
router.get("/view/:id",tournamentController.getTournamentById);

//update tournament details 
router.put("/update/:id",authenticate,authorize(["admin","organizer"]),upload.single("image"),tournamentController.updateTournament);

//delete tournament 
router.delete("/delete/:id",authenticate,authorize(["admin","organizer"]),tournamentController.deleteTournament);

module.exports=router;