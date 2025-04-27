const jwt = require("jsonwebtoken");

const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication failed" });
  }

  // Generate JWT with 'userId'
  const token = jwt.sign({ userId: req.user._id ,role: req.user.role}, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Set JWT cookie
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 3600000,
  });

  console.log("Cookie set successfully");

  res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
};


module.exports = { googleAuthSuccess};
