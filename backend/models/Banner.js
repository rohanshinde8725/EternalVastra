const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "Discover our exquisite collection of sarees crafted with tradition, quality & love." },
    buttonText: { type: String, trim: true, default: "Shop Now" },
    image: { type: String, required: true, trim: true },
    link: { type: String, default: "/shop" },
    position: { type: String, default: "Hero Main Banner" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

bannerSchema.index({ active: 1, createdAt: -1 });

module.exports = mongoose.model("Banner", bannerSchema);
