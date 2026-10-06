const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    userId: { type: String, default: "", trim: true },
    productId: { type: String, default: "", trim: true },
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

reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ productId: 1 });

module.exports = mongoose.model("Review", reviewSchema);
