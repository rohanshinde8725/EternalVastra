const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    name: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNo: { type: String, default: "", trim: true },
    subject: { type: String, default: "General Inquiry", trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
