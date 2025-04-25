const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const cookieParser = require("cookie-parser");
const authenticate = require("./middlewares/authMiddleware");
const authorize=require("./middlewares/roleMiddleware");
const cors = require("cors");
const coachRoutes=require("./routes/coachRoutes");
const adminRoutes=require("./routes/adminRoutes");
const newsRoutes=require("./routes/newsRoutes");
const tournamentRoutes=require("./routes/tournamentRoutes");
const userRoutes=require("./routes/userRoutes");

dotenv.config(); // Load environment variables

const app = express();

//  Connect to MongoDB before setting up middleware
connectDB();

//  Middleware (in correct order)
console.log("CORS Origin:", process.env.FRONTEND_URL);

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`, // frontend URL
    credentials: true,
  }));

app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies
app.use(passport.initialize()); // Initialize Passport.js

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/coach",coachRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/news",newsRoutes);
app.use("/api/tournament",tournamentRoutes)

//  Protected Route
app.get("/profile", authenticate,authorize(["admin"]),(req, res) => {
    res.send("hello profile with protected");
});


//  Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
});
