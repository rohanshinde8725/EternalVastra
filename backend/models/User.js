const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    avatar: { type: String, default: "/images/testimonial/testimonial-1.png" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
