const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: { type: String, unique: true, sparse: true }, // Only for Google users
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () { return !this.googleId; } }, // Password required only if no Google ID
    role: { type: String, enum: ["admin","player","organizer", "coach" ], default: "player" },
    name: { type: String },
    phone: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
