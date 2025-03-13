const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Team name
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of players in the team
  captain: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Team captain
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Team coach
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
