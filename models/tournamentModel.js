const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    sportType:{type:String, enum: ["kabaddi", "hockey", "cricket"],required:true},
    description: { type: String },
    startDate: { type: Date, required: true },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed"], default: "Upcoming" },
    image:{type:String},
    registeredTeams: [
        {
            team: { type: mongoose.Schema.Types.ObjectId, ref: "Team"}, // Team that registered
            status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }, // Approval status
            registeredAt: { type: Date, default: Date.now } // Registration timestamp
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Organizer/Admin
}, { timestamps: true });

const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);
module.exports = Tournament;
