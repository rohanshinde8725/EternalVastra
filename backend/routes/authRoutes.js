const express = require("express");
const {
  sendSignupOtp,
  verifySignupOtp,
  login,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
} = require("../controllers/authController");

const router = express.Router();

// Sign Up OTP Flow
router.post("/send-signup-otp", sendSignupOtp);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/register", sendSignupOtp);

// Direct Sign In Flow
router.post("/login", login);

// Forgot / Reset Password via OTP Flow
router.post("/send-forgot-password-otp", sendForgotPasswordOtp);
router.post("/reset-password-with-otp", resetPasswordWithOtp);
router.post("/forgot-password", sendForgotPasswordOtp);

module.exports = router;
