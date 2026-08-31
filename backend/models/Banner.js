const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    image: { type: String, required: true, trim: true },
    link: { type: String, default: "/shop" },
    position: { type: String, default: "Hero Main Banner" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Banner", bannerSchema);
