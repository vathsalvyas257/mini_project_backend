const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userValidationSchema=require("../validation/userValidationSchema");

module.exports.signup = async (req, res) => {
    try {
        // Validate request body using Joi schema
        const { error } = userValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }

        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}


module.exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Secure Cookie Settings
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
        maxAge: 3600000,
      });
  
      // Send back user info (without password)
      const { _id, name, role } = user;
  
      res.status(200).json({
        message: "Login successful",
        user: {
          id: _id,
          name,
          email,
          role,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
module.exports.logout = async (req, res) => {
    try {
        res.cookie("auth_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 0, // Expire the cookie immediately
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
