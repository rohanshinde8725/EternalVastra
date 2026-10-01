const mongoose = require("mongoose");
const adminProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "/images/testimonial/testimonial-1.webp" },
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("AdminProfile", adminProfileSchema);

