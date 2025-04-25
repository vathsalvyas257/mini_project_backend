const User=require("../models/userModel");

exports.getUserDetails=async (req,res)=>{
        const userId = req.user.userId; // Assuming the user is authenticated and `req.user` is populated
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).json({ message: "User not found" });
            }
            res.json({
              email: user.email,
              role: user.role,
              name: user.name,
              phone: user.phone,
              dob: user.dob,
              gender: user.gender,
              profileImage: user.profileImage,
            });
          })
          .catch((err) => res.status(500).json({ message: "Error fetching user details" }));
};

exports.updateUserDetails = async (req, res) => {
  try {
    console.log("Update Profile - Body:", req.body);
    console.log("Update Profile - File:", req.file);

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { name, phone, dob, gender } = req.body;

    // Update fields if they exist
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;

    // Use the image URL from Cloudinary (already uploaded by multer)
    if (req.file && req.file.path) {
      user.profileImage = req.file.path; // Multer + CloudinaryStorage gives you the hosted URL
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};


exports.getAllUsers=async (req, res) => {
  try {
    const users = await User.find({}, "email"); // only return email field
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", err });
  }
};
