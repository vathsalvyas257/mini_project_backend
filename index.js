const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const app = express();
const authRoutes=require("./routes/authRoutes")

app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use("/auth", authRoutes);


// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});