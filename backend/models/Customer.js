const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "Mumbai, Maharashtra" },
    ordersCount: { type: Number, default: 1, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    avatar: { type: String, default: "" },
    tier: {
      type: String,
      enum: ["VIP Patron", "Gold Member", "Silver Patron"],
      default: "Silver Patron",
    },
    joined: { type: String, default: "Jan 2025" },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Customer", customerSchema);
