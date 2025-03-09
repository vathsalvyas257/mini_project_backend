const jwt = require("jsonwebtoken");

const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Set token in HttpOnly cookie
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allows cross-origin cookies in production
    maxAge: 3600000, // 1 hour expiration
  });

  console.log("Cookie set successfully");
  res.redirect(`${process.env.FRONTEND_URL}/profile`); // Redirect user to frontend
};

module.exports = { googleAuthSuccess};
