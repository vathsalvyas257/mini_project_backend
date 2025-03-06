const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["player", "admin", "coach", "viewer"], default: "player" },
    name: { type: String },
    phone: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});


const User=mongoose.model("User",userSchema);

module.exports=User;