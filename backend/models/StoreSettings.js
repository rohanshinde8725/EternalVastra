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
<<<<<<< HEAD
    instagram: { type: String, default: "https://www.instagram.com/_rohan_.0710/" },
    facebook: { type: String, default: "https://www.facebook.com/" },
    github: { type: String, default: "https://github.com/rohanshinde8725" },
    linkedin: { type: String, default: "https://www.linkedin.com/in/rohan-shinde-397195256" },
=======
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("StoreSettings", storeSettingsSchema);
