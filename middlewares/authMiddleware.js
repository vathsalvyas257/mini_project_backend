const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.auth_token; // Get token from cookies
    // console.log(token);

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user data to request
        next(); // Move to next middleware/route
    } catch (error) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;
