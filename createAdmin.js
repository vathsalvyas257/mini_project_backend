const mongoose = require("mongoose");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
const connectDB=require("./config/db");
require("dotenv").config();

connectDB();
async function ensureAdminExists() {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("Rgukt@123", 10); // Change password as needed
            await User.create({
                name: "Default Admin",
                email: "adminrguktrkv@gmail.com",
                password: hashedPassword,
                role:"admin"
            });
            console.log("Admin account created.");
        } else {
            console.log("Admin already exists.");
        }
        mongoose.disconnect();
    } catch (err) {
        console.error("Error creating admin:", err);
        mongoose.disconnect();
    }
}

ensureAdminExists();
