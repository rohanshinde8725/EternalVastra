const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    material: { type: String, default: "" },
    occasion: { type: String, default: "" },
    care: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    images: { type: [String], default: [] },
    specifications: {
      fabric: { type: String, default: "" },
      sareeLength: { type: String, default: "5.5 Meters" },
      blousePiece: { type: String, default: "Included (0.8 Meter Unstitched)" },
      color: { type: String, default: "" },
      pattern: { type: String, default: "" },
      workType: { type: String, default: "" },
      occasion: { type: String, default: "" },
      care: { type: String, default: "" },
    },
    shippingInfo: { type: String, default: "" },
    returnInfo: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false, collection: "ProductsDetail" }
);

module.exports = mongoose.model("ProductDetail", productDetailSchema);
