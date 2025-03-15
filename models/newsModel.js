const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, //cloudinart string
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  },
  { timestamps: true }
);

const News= mongoose.model("News", newsSchema);
module.exports=News;
