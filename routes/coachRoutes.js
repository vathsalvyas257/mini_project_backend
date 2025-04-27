const express = require("express");
const router = express.Router();
const coachController= require("../controllers/coachController");
const authenticate=require("../middlewares/authMiddleware");
const authorize=require("../middlewares/roleMiddleware");
const { upload } = require("../config/cloudinary");

// Only coach can assign organisers
// router.put("/assign-organizer", authenticate, authorize(["coach"]), coachController.assignOrganiserByEmail);

// coach can create team
router.post("/createTeam",authenticate,authorize(["coach"]),upload.single("teamLogo"),coachController.createTeam);

//view all the coach teams
router.get("/viewmyTeams",authenticate,authorize(["coach"]),coachController.getCoachTeams);

//delete team
router.delete("/delete/:teamId",authenticate,authorize(["coach"]),coachController.deleteCoachTeam);


module.exports = router;
