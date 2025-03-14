const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true }, // Team name
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of players in the team
  captain: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Team captain
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Team coach
  sportType:{type:String,enum:["cricket","kabaddi","hockey"],required:true},
  teamLogo:{type:String}
}, { timestamps: true });

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
