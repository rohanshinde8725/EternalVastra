const express = require("express");
const {
  sendSignupOtp,
  verifySignupOtp,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Sign Up OTP Flow
router.post("/send-signup-otp", sendSignupOtp);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/register", sendSignupOtp);

// Direct Sign In Flow (No OTP required for login)
router.post("/login", login);

module.exports = router;
