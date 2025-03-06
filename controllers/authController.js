const User=require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports.signup=async(req,res)=>{
 try {
    const { email, password } = req.body;
    // console.log(email,password);

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // Create and save new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
} catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
}
};
module.exports.login=async(req,res)=>{
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user){ 
            return res.status(404).json({ message: "User not found" });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

}