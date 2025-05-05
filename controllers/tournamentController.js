const Tournament=require("../models/tournamentModel");
const Team=require("../models/teamModel");
const tournamentValidationSchema = require("../validation/tournamentValidationSchema");


//  Create a New Tournament (Admin/Organizer)
exports.createTournament = async (req, res) => {
    try {
      // Debug: Log incoming request data
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);
  
      // Validate required fields
      if (!req.body.title || !req.body.startDate || !req.body.sportType) {
        return res.status(400).json({
          success: false,
          message: "Title, startDate, and sportType are required fields"
        });
      }
  
      const { title, sportType, description, startDate } = req.body;
      const createdBy = req.user.userId;
      
      let logo = "";
      if (req.file) {
        logo = req.file.path;
      }
  
      const newTournament = new Tournament({ 
        title, 
        sportType, 
        description, 
        startDate, 
        image: logo, 
        createdBy 
      });
  
      await newTournament.save();
  
      res.status(201).json({ 
        success: true, 
        message: "Tournament created successfully", 
        tournament: newTournament 
      });
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error creating tournament", 
        error: error.message 
      });
    }
  };
  
//fetch all tournaments
exports.getAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate("createdBy", "name email");
        res.status(200).json({ success: true, tournaments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tournaments", error: error.message });
    }
};

//fetch tournament by id
exports.getTournamentById = async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await Tournament.findById(id)
            .populate("createdBy", "name email");  // Only populate tournament creator

        if (!tournament) return res.status(404).json({ success: false, message: "Tournament not found" });

        res.status(200).json({ success: true, tournament });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching tournament", error: error.message });
    }
};
exports.updateTournament= async (req, res) => {
    try {
        const { id } = req.params;
        const { description, startDate } = req.body;

        let updateFields = {};

        // Check if a new image is uploaded and upload cloudinary string
        if (req.file) {
            updateFields.image=req.file.path           
        }

        // Update fields if provided
        if (description) updateFields.description = description;
        if (startDate) updateFields.startDate = startDate;

        // Check if at least one field is being updated
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }
        // Find and update tournament in a single step
        const updatedTournament = await Tournament.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!updatedTournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        res.status(200).json({ message: "Tournament updated successfully", tournament: updatedTournament });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteTournament = async (req, res) => {
    try {
        let { id } = req.params;

        // Find the tournament by ID
        const tournament = await Tournament.findById(id);

        // If the tournament does not exist, return a 404 error
        if (!tournament) {
            return res.status(404).json({ message: "No tournament found to delete" });
        }

        // Delete the tournament
        await Tournament.findByIdAndDelete(id);

        res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//coach register his team for a tournament
exports.registerTeam = async (req, res) => {
    try {
      const { tournamentId, teamId } = req.params;
      const coachId = req.user.userId; // Authenticated coach ID
      console.log(coachId);
      console.log(teamId)
 
      // Ensure the team belongs to the coach
      const team = await Team.findOne({ _id: teamId, coach:coachId });
      console.log(team);
      if (!team) {
        return res.status(403).json({ message: "You can only register your own teams" });
      }
 
      // Ensure the tournament exists
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
       // Ensure the team and tournament have the same sport type
       if (team.sportType !== tournament.sportType) {
        return res.status(400).json({ message: "Team and tournament sport types do not match" });
    }
 
      // Check if the team is already registered
      const isAlreadyRegistered = tournament.registeredTeams.some(
        (registered) => registered.team.toString() === teamId
      );
 
      if (isAlreadyRegistered) {
        return res.status(400).json({ message: "Team is already registered for this tournament" });
      }
 
      // Add team to tournament's registeredTeams
      tournament.registeredTeams.push({
        team: teamId,
        status: "Pending",
      });
 
      await tournament.save();
 
      // Populate the team details before sending the response
      const updatedTournament = await Tournament.findById(tournamentId)
        .populate("registeredTeams.team", "teamName");
 
      res.status(201).json({ message: "Team registered successfully!", tournament: updatedTournament });
 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
 };
 
 exports.getTournamentTeams = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate({
        path: "registeredTeams.team",
        select: "teamName teamLogo"
      });

    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    res.json(tournament.registeredTeams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTeamStatus=async (req,res)=>{
  const { status } = req.body; // status = "Accepted" or "Rejected"
  try {
      const tournament = await Tournament.findById(req.params.tournamentId);
      if (!tournament) return res.status(404).json({ message: "Tournament not found" });

      const teamEntry = tournament.registeredTeams.find(
          (entry) => entry.team.toString() === req.params.teamId
      );

      if (!teamEntry) return res.status(404).json({ message: "Team not registered" });

      teamEntry.status = status;
      await tournament.save();

      res.json({ message: `Team ${status.toLowerCase()} successfully.` });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }

}
