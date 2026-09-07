const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  getContactMessages,
  updateContactMessageStatus,
} = require("../controllers/contactController");

// Public contact submission
router.post("/", submitContactForm);
router.post("/send", submitContactForm);

// Admin queries
router.get("/", getContactMessages);
router.patch("/:id/status", updateContactMessageStatus);

module.exports = router;
