const mongoose = require("mongoose");

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Eternal Vastra" },
    tagline: { type: String, default: "Elegance Eternal — Handcrafted Indian Sarees" },
    contactEmail: { type: String, default: "support@eternalvastra.com" },
    contactPhone: { type: String, default: "+91 98200 12345" },
    currency: { type: String, default: "INR (₹)" },
    freeShippingAbove: { type: String, default: "1999" },
    standardShippingFee: { type: String, default: "150" },
    gstPercentage: { type: String, default: "5" },
    codEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
