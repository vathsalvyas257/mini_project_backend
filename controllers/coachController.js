const User = require("../models/userModel");
const Team=require("../models/teamModel");
const Tournament=require("../models/tournamentModel");

// Coach assigns a user as Organiser
exports.assignOrganiserByEmail= async (req, res) => {
 try{
    const{email}=req.body;
    //find user by email

    const user=await User.findOne({email});
    if(!user) return res.status(404).json({message:"user not found"});

    //update role to organiser
    user.role="organizer";
    await user.save();

    res.status(201).json({message:`user with email ${email} assigned as organizer`});
 }catch(error){
    res.status(500).json({message:"server errror",error})
 }
};

//creating a team under his coaching 
exports.createTeam = async (req, res) => {
   try {
       const { teamName, playerEmails, captainEmail, sportType } = req.body;
       const coachId = req.user.userId; // Get coach ID from authenticated user

       // Validate if playerEmails array is provided
       if (!playerEmails || !Array.isArray(playerEmails) || playerEmails.length === 0) {
           return res.status(400).json({ message: "A team must have players" });
       }

       // Fetch players based on emails
       const players = await User.find({ email: { $in: playerEmails } }).select("_id email");
       const playerIds = players.map(player => player._id);
       const foundEmails = players.map(player => player.email);

       // Find missing player emails
       const missingEmails = playerEmails.filter(email => !foundEmails.includes(email));
       if (missingEmails.length > 0) {
           return res.status(400).json({ 
               message: "Some players do not exist in the system", 
               missingPlayers: missingEmails 
           });
       }

       // Find captain by email
       const captain = await User.findOne({ email: captainEmail });
       if (!captain) {
           return res.status(400).json({ message: "Captain must be a valid registered player" });
       }

       // Check for existing team within the same sport
       const existingTeam = await Team.findOne({ teamName, sportType });
       if (existingTeam) {
           return res.status(400).json({ message: "Team name already exists for this sport" });
       }

       // Upload team logo (if provided)
       let teamLogo = "";
       if (req.file) {
           teamLogo = req.file.path; // Multer automatically provides Cloudinary URL
         //   console.log(teamLogo);
       }

       // Create team
       const newTeam = new Team({
           teamName,
           players: playerIds,
           captain: captain._id,
           coach: coachId,
           sportType,
           teamLogo // Save uploaded logo URL
       });

       await newTeam.save();
       res.status(201).json({ message: "Team created successfully", team: newTeam });

   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Server error", error: error.message });
   }
};

//fetching all the teams of the coach
exports.getCoachTeams = async (req, res) => {
   try {
       const coachId = req.user.userId; // Authenticated coach ID

       // Fetch all teams where the logged-in user is the coach
       const teams = await Team.find({ coach: coachId }).select("teamName sportType teamLogo players");

       res.status(200).json({ teams });
   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Server error", error: error.message });
   }
};

//delete team of him
exports.deleteCoachTeam = async (req, res) => {
   try {
       const { teamId } = req.params; // Get team ID from URL

       // Delete the team directly
       await Team.findByIdAndDelete(teamId);

       res.status(200).json({ message: "Team deleted successfully" });

   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Server error", error: error.message });
   }
};



