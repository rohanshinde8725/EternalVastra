const mongoose = require("mongoose");

const recycleBinSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      required: true,
      enum: ["product", "category", "banner", "order", "blog", "other"],
      index: true,
    },
    originalId: { type: String, default: "" },
    itemTitle: { type: String, required: true, trim: true },
    itemSubtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    deletedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("RecycleBin", recycleBinSchema);
