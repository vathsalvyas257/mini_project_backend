const Tournament = require("../models/TournamentModel");

//  Create a New Tournament (Admin/Organizer)
exports.createTournament = async (req, res) => {
    try {
        const { title, sportType, description, startDate } = req.body;
        const createdBy = req.user.userId;

        let imageBase64 = "";
        if (req.file) {
            imageBase64 = req.file.buffer.toString("base64"); // Convert image to Base64
        }

        const newTournament = new Tournament({ title, sportType, description, startDate, image: imageBase64, createdBy });
        await newTournament.save();

        res.status(201).json({ success: true, message: "Tournament created successfully", tournament: newTournament });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating tournament", error: error.message });
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

        // Check if a new image is uploaded and convert to Base64
        if (req.file) {
            updateFields.image = req.file.buffer.toString("base64");
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

