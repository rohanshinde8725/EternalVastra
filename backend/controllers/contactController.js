const ContactMessage = require("../models/ContactMessage");
const { sendContactEmail } = require("../utils/mailer");

// Submit Contact Form (Instant sub-100ms response + Background Email Dispatch)
const submitContactForm = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNo, email, subject, message } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ success: false, message: "First name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = (lastName || "").trim();
    const cleanPhone = (phoneNo || "").trim();
    const cleanSubject = (subject || "General Inquiry").trim();
    const cleanMessage = message.trim();

    // 1. Immediately save inquiry in Database
    let savedMessage = null;
    try {
      savedMessage = await ContactMessage.create({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        name: `${cleanFirstName} ${cleanLastName}`.trim(),
        email: cleanEmail,
        phoneNo: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        status: "unread",
      });
    } catch (dbErr) {
      console.warn(`[CONTACT] Warning saving message to database: ${dbErr.message}`);
    }

    // 2. Respond immediately to the user (instant sub-second response)
    res.status(200).json({
      success: true,
      message: "Thank you for reaching out! Your message has been sent successfully. We will get back to you shortly.",
      data: savedMessage,
    });

    // 3. Dispatch both Admin and Customer Confirmation emails asynchronously in the background
    setImmediate(async () => {
      try {
        await sendContactEmail({
          firstName: cleanFirstName,
          lastName: cleanLastName,
          phoneNo: cleanPhone,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        });
      } catch (mailErr) {
        console.error(`[CONTACT] Background email sending error: ${mailErr.message}`);
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get All Contact Messages (Admin access)
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

// Update Message Status (e.g. mark as read or replied)
const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
  updateContactMessageStatus,
};
