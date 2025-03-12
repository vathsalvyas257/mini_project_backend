const News = require("../models/newsModel");

// Add news (Admin & Organiser)
exports.addNews = async (req, res) => {
    try {
      const { title, content } = req.body;
  
      // Check if required fields exist
      if (!title || !content || !req.file) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Convert image to Base64 (for storing as a string)
      const imageBase64 = req.file.buffer.toString("base64");
      console.log(req.user.userId);
  
      // Create news object and save to DB
      const news = new News({
        title,
        content,
        image: imageBase64,
        createdBy: req.user.userId, // Who posted the news
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
    const {content} = req.body;

    // Find existing news
    let news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Check if a new image is uploaded
    if (req.file) {
      // Convert new image to Base64
      news.image = req.file.buffer.toString("base64");
    }

    // Update title and content if provided
    if (content) news.content = content;

    // Save the updated news
    await news.save();

    res.status(200).json({ message: "News updated successfully", news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
