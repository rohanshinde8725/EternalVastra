const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    img: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: [String],
      required: true,
      validate: {
        validator: (categories) => categories.length > 0,
        message: "At least one category is required",
      },
    },
    title: { type: String, required: true, trim: true },
    tag: { type: String, trim: true, default: "New" },
    discountPrice: { type: Number, required: true, min: 0 },
    actualPrice: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    ratings: { type: String, default: "0" },
    details: {
      description: { type: String, default: "" },
      material: { type: String, default: "" },
      occasion: { type: String, default: "" },
      care: { type: String, default: "" },
      highlights: { type: [String], default: [] },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
