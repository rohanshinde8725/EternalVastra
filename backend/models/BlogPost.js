const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  heading: { type: String, default: "" },
  paragraph: { type: String, default: "" },
  bulletPoints: [{ type: String }],
  image: { type: String, default: "" },
}, { _id: false });

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    category: { type: String, required: true, trim: true, default: "Saree Guides" },
    author: { type: String, required: true, trim: true, default: "Eternal Vastra" },
    authorRole: { type: String, default: "Master Drape Stylist & Textile Curator" },
    authorAvatar: { type: String, default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    date: { type: String, default: "Aug 18, 2026" },
    readTime: { type: String, default: "5 min read" },
    cover: { type: String, required: true, default: "/images/silk/silk-1.jpg" },
    excerpt: { type: String, trim: true, default: "" },
    summary: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },
    quote: { type: String, default: "" },
    quoteAuthor: { type: String, default: "" },
    sections: [sectionSchema],
    tips: [{ type: String }],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 1240 },
    likes: { type: Number, default: 88 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("BlogPost", blogPostSchema);
