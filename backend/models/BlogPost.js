const mongoose = require("mongoose");
const blogPostSchema = new mongoose.Schema({ title: { type: String, required: true, trim: true }, author: { type: String, required: true, trim: true }, excerpt: { type: String, trim: true, default: "" } }, { timestamps: true, versionKey: false });
module.exports = mongoose.model("BlogPost", blogPostSchema);
