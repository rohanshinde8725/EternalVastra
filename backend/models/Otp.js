const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    type: { type: String, enum: ["signup", "login"], default: "signup" },
    payload: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // Expires in 10 minutes
  },
  { versionKey: false }
);

module.exports = mongoose.model("Otp", otpSchema);
