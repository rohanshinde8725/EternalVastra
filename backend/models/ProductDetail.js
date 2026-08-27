const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    description: { type: String, default: "" },
    material: { type: String, default: "" },
    occasion: { type: String, default: "" },
    care: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false, collection: "ProductsDetail" }
);

module.exports = mongoose.model("ProductDetail", productDetailSchema);
