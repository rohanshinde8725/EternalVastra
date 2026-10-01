const User = require("../models/User");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../utils/mailer");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. Send OTP for Sign Up (Mandatory OTP verification for new registrations)
const sendSignupOtp = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const otpCode = generateOtp();
    const role = cleanEmail === "rohanshinde8725@gmail.com" || cleanEmail.includes("admin") ? "admin" : "customer";

    // Store or replace pending registration OTP
    await Otp.deleteMany({ email: cleanEmail, type: "signup" });
    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      type: "signup",
      payload: {
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone || "",
        role,
      },
    });

    await sendOtpEmail(cleanEmail, otpCode, "signup");

    res.json({
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      devOtp: otpCode,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Verify Sign Up OTP & Save into MongoDB Database
const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      type: "signup",
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    const { name, password, phone, role } = otpRecord.payload;

    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      user = await User.create({
        name,
        email: cleanEmail,
        password,
        phone: phone || "",
        role: cleanEmail === "rohanshinde8725@gmail.com" ? "admin" : (role || "customer"),
        avatar: "/images/default-avatar.webp",
      });
    }

    await Otp.deleteMany({ email: cleanEmail, type: "signup" });

    res.status(201).json({
      message: "Account verified and registered successfully in database!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Direct Login (No OTP needed for Sign In)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Auto-create or ensure rohanshinde8725@gmail.com is admin
    if (cleanEmail === "rohanshinde8725@gmail.com" && password === "admin123") {
      let adminUser = await User.findOne({ email: cleanEmail });
      const adminProfile = await require("../models/AdminProfile").findOne();
      const currentAvatar = adminProfile?.avatar || "/uploads/admin/upload-1790850492288-440658.webp";

      if (!adminUser) {
        adminUser = await User.create({
          name: "Rohan Shinde",
          email: cleanEmail,
          password: "admin123",
          phone: "+91 98200 87250",
          role: "admin",
          avatar: currentAvatar,
        });
      } else {
        if (adminUser.role !== "admin" || adminUser.password !== "admin123") {
          adminUser.role = "admin";
          adminUser.password = "admin123";
        }
        if (adminProfile?.avatar && (!adminUser.avatar || adminUser.avatar.includes("default-avatar") || adminUser.avatar.includes("testimonial-1"))) {
          adminUser.avatar = adminProfile.avatar;
        }
        await adminUser.save();
      }
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password credentials" });
    }

    if (user.isBlocked || user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been suspended by the administrator. Please contact support at support@eternalvastra.com."
      });
    }

    res.json({
      message: "Signed in successfully!",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. Send Forgot Password OTP
const sendForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email address is required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "No registered account found with this email address." });
    }

    if (user.isBlocked || user.status === "blocked") {
      return res.status(403).json({
        message: "Your account is suspended. Please contact support at support@eternalvastra.com."
      });
    }

    const otpCode = generateOtp();

    // Remove any previous forgot-password OTP for this email
    await Otp.deleteMany({ email: cleanEmail, type: "forgot-password" });
    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      type: "forgot-password",
      payload: { email: cleanEmail, userId: user._id },
    });

    await sendOtpEmail(cleanEmail, otpCode, "forgot-password");

    res.json({
      message: `A password reset verification code has been sent to ${cleanEmail}`,
      email: cleanEmail,
      devOtp: otpCode,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Verify OTP and Reset Password
const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP verification code, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters in length" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      otp: otp.trim(),
      type: "forgot-password",
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP verification code. Please request a new one." });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ email: cleanEmail, type: "forgot-password" });

    res.json({
      message: "Your password has been successfully reset! You can now use your new password.",
      email: cleanEmail,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendSignupOtp,
  verifySignupOtp,
  login,
  register: sendSignupOtp,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
};

