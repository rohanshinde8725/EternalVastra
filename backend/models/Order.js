const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
    price: { type: Number, required: true },
    img: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    paymentMethod: { type: String, default: "UPI (Google Pay)" },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Delivered", "Processing", "Shipped", "Cancelled", "Pending"],
      default: "Pending",
    },
    items: [orderItemSchema],
    orderDate: { type: String, default: () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
