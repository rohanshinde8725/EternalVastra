const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, trim: true, default: "" },
    banner: { type: String, default: "" },
    count: { type: Number, default: 0 },
    share: { type: String, default: "10%" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Category", categorySchema);
