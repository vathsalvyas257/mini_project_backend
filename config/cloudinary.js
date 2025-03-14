const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "team_logos", // Folder where images will be stored
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => {
      const filename = file.originalname.split('.').slice(0, -1).join('.'); // Remove extension
      return `${Date.now()}-${filename}`;
    }
  }
});

// Multer middleware
const upload = multer({ storage });

module.exports = { upload, cloudinary };
