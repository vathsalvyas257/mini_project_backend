const User = require("../models/userModel");

// Admin assigns a user a role (Coach or Organizer) using email
exports.assignRoleByEmail = async (req, res) => {
  try {
    const { email, role } = req.body; // Get email & role from request body

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Assign the selected role (no extra validation)
    user.role = role;
    await user.save();

    res.status(201).json({ message: `User with email ${email} assigned as ${role} successfully`});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
