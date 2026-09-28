const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    avatar: { type: String, default: "/images/default-avatar.png" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        isDefault: { type: Boolean, default: false },
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
        phone: { type: String, required: true }
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
