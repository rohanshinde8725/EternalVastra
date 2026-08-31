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
        avatar: "/images/testimonial/testimonial-1.png",
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
      if (!adminUser) {
        adminUser = await User.create({
          name: "Rohan Shinde",
          email: cleanEmail,
          password: "admin123",
          phone: "+91 98200 87250",
          role: "admin",
          avatar: "/images/testimonial/testimonial-1.png",
        });
      } else if (adminUser.role !== "admin" || adminUser.password !== "admin123") {
        adminUser.role = "admin";
        adminUser.password = "admin123";
        await adminUser.save();
      }
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password credentials" });
    }

    res.json({
      message: "Signed in successfully!",
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

module.exports = {
  sendSignupOtp,
  verifySignupOtp,
  login,
  register: sendSignupOtp,
};
