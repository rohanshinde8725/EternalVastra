const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    date: { type: String, default: () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
    comment: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Hidden"],
      default: "Approved",
    },
    avatar: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Review", reviewSchema);
