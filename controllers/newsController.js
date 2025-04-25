const News = require("../models/newsModel");

//view news
exports.viewNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, news });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ success: false, message: "Failed to fetch news." });
  }
};

// Add news (Admin & Organiser)
exports.addNews = async (req, res) => {
    try {
      const { title, content } = req.body;
  
      // Check if required fields exist
      if (!title || !content || !req.file) {
        return res.status(400).json({ message: "All fields are required" });
      }
      // Create news object and save to DB
      const news = new News({
        title,
        content,
        image: req.file.path, //contain the cloudinary url for the image
        createdBy: req.user.userId, // Who posted the news ,this is from the req.body after login we add user to the req
      });
  
      await news.save();
      res.status(201).json({ message: "News added successfully", news });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

// Delete news (Admin only)
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    await News.findByIdAndDelete(id);
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//update news content or image
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    let news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Update fields if provided
    if (title) news.title = title;
    if (content) news.content = content;
    
    // Handle image upload if present
    if (req.file) {
      news.image = req.file.path; // or your cloudinary URL logic
    }

    await news.save();

    res.status(200).json({ 
      success: true,
      message: "News updated successfully", 
      news 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};