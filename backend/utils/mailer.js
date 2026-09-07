const nodemailer = require("nodemailer");

let cachedTransporter = null;

// Configure and reuse pooled transporter
const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    return cachedTransporter;
  }

  // Default test / dev configuration
  cachedTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal.pass",
    },
  });
  return cachedTransporter;
};

const sendOtpEmail = async (toEmail, otp, type = "signup") => {
  const isSignup = type === "signup";
  const subject = isSignup
    ? `Your Eternal Vastra Verification Code: ${otp}`
    : `Your Eternal Vastra Login OTP: ${otp}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FEFAF8; margin: 0; padding: 20px; color: #2D3748; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #F3E7E4; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #6B1527 0%, #3D0A14 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
          .emblem { font-size: 24px; color: #F59E0B; margin-bottom: 5px; }
          .brand { font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
          .tagline { font-size: 11px; letter-spacing: 3px; color: #FDE8EC; margin-top: 4px; text-transform: uppercase; }
          .body { padding: 35px 30px; text-align: center; }
          .greeting { font-size: 18px; font-weight: 600; color: #1A202C; margin-bottom: 10px; }
          .message { font-size: 13px; color: #718096; line-height: 1.6; margin-bottom: 25px; }
          .otp-box { background: #FEF2F2; border: 2px dashed #6B1527; border-radius: 12px; padding: 18px 24px; display: inline-block; margin: 10px 0 25px 0; }
          .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #6B1527; margin: 0; font-family: monospace; }
          .expiry { font-size: 11px; color: #9B2C2C; margin-top: 6px; font-weight: 600; }
          .footer { background: #FAF5F0; padding: 20px; text-align: center; font-size: 11px; color: #A0AEC0; border-top: 1px solid #F3E7E4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emblem">✦ ❖ ✦</div>
            <h1 class="brand">Eternal Vastra</h1>
            <div class="tagline">Elegance Eternal • Handcrafted Sarees</div>
          </div>
          <div class="body">
            <div class="greeting">${isSignup ? "Verify Your Account Registration" : "Authentication Security Code"}</div>
            <p class="message">
              ${isSignup 
                ? "Thank you for joining Eternal Vastra. Please use the verification code below to complete your account registration and explore our royal handloom saree collections."
                : "You requested to sign in to your Eternal Vastra account. Please enter the one-time security password below."}
            </p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="expiry">Valid for 10 minutes only</div>
            </div>
            <p class="message" style="font-size: 11px; color: #A0AEC0; margin-top: 15px;">
              If you did not request this verification code, please ignore this email or contact support.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Eternal Vastra. All rights reserved.<br/>
            Pure Silk • Handloom Cottons • Royal Paithanis
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Eternal Vastra" <no-reply@eternalvastra.com>',
      to: toEmail,
      subject,
      html: htmlContent,
    });
    console.log(`[MAILER] OTP email successfully sent to ${toEmail} -> OTP: ${otp}`);
    return { success: true, otp };
  } catch (err) {
    console.warn(`[MAILER] Email delivery notice for ${toEmail}: ${err.message}. OTP code: ${otp}`);
    return { success: false, otp, error: err.message };
  }
};

const sendContactEmail = async ({ firstName, lastName, phoneNo, email, subject, message }) => {
  const fullName = `${firstName} ${lastName || ""}`.trim();
  const inquirySubject = subject || "Customer Inquiry";
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "rohanshinde8725@gmail.com";
  const fromEmail = process.env.EMAIL_FROM || `"Eternal Vastra" <${process.env.SMTP_USER || "rohanshinde8725@gmail.com"}>`;
  const timeString = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // 1. Email to Admin / Support Team
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FEFAF8; margin: 0; padding: 20px; color: #2D3748; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #F3E7E4; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #6B1527 0%, #3D0A14 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
          .emblem { font-size: 22px; color: #F59E0B; margin-bottom: 6px; }
          .brand { font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
          .tagline { font-size: 11px; letter-spacing: 3px; color: #FDE8EC; margin-top: 4px; text-transform: uppercase; }
          .badge { display: inline-block; background: #FEF2F2; color: #6B1527; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #FECACA; }
          .body { padding: 30px 28px; }
          .section-title { font-size: 16px; font-weight: 700; color: #1A202C; margin-bottom: 15px; border-bottom: 2px solid #F6DBC6; padding-bottom: 6px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .info-table td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #F3E7E4; }
          .info-table td.label { width: 35%; font-weight: 600; color: #4A5568; background-color: #FEFAF8; }
          .info-table td.value { color: #1A202C; font-weight: 500; }
          .message-card { background: #FEFAF8; border-left: 4px solid #6B1527; padding: 18px 20px; border-radius: 0 10px 10px 0; margin-top: 10px; font-size: 14px; line-height: 1.65; color: #2D3748; white-space: pre-wrap; word-break: break-word; }
          .btn-container { text-align: center; margin-top: 30px; }
          .reply-btn { background: #6B1527; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-block; letter-spacing: 0.5px; }
          .footer { background: #FAF5F0; padding: 20px; text-align: center; font-size: 11px; color: #718096; border-top: 1px solid #F3E7E4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emblem">✦ ❖ ✦</div>
            <h1 class="brand">Eternal Vastra</h1>
            <div class="tagline">Luxury Handcrafted Saree Couture</div>
            <div class="badge">New Contact Inquiry</div>
          </div>
          <div class="body">
            <div class="section-title">Customer Information</div>
            <table class="info-table">
              <tr>
                <td class="label">Customer Name</td>
                <td class="value"><strong>${fullName}</strong></td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value"><a href="mailto:${email}" style="color: #6B1527; text-decoration: underline;">${email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone Number</td>
                <td class="value">${phoneNo || '<span style="color: #A0AEC0;">Not provided</span>'}</td>
              </tr>
              <tr>
                <td class="label">Subject</td>
                <td class="value"><strong>${inquirySubject}</strong></td>
              </tr>
              <tr>
                <td class="label">Received Date & Time</td>
                <td class="value">${timeString}</td>
              </tr>
            </table>

            <div class="section-title">Message Content</div>
            <div class="message-card">
              ${message}
            </div>

            <div class="btn-container">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(inquirySubject)} - Eternal Vastra" class="reply-btn">
                ✉ Reply directly to ${firstName}
              </a>
            </div>
          </div>
          <div class="footer">
            This message was submitted from the Eternal Vastra Contact Page.<br/>
            © ${new Date().getFullYear()} Eternal Vastra. Flagship Studio: Mumbai, Maharashtra.
          </div>
        </div>
      </body>
    </html>
  `;

  // 2. Auto-Acknowledgement Email to Customer
  const customerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FEFAF8; margin: 0; padding: 20px; color: #2D3748; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #F3E7E4; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #6B1527 0%, #3D0A14 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .emblem { font-size: 22px; color: #F59E0B; margin-bottom: 6px; }
          .brand { font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
          .tagline { font-size: 11px; letter-spacing: 3px; color: #FDE8EC; margin-top: 4px; text-transform: uppercase; }
          .body { padding: 32px 28px; }
          .greeting { font-size: 18px; font-weight: 700; color: #1A202C; margin-bottom: 12px; }
          .paragraph { font-size: 13.5px; line-height: 1.7; color: #4A5568; margin-bottom: 18px; }
          .summary-box { background: #FEFAF8; border: 1px solid #F3E7E4; border-radius: 12px; padding: 18px 20px; margin: 20px 0; }
          .summary-title { font-size: 12px; font-weight: 700; color: #6B1527; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .summary-text { font-size: 13px; color: #4A5568; line-height: 1.6; font-style: italic; }
          .contact-bar { background: #FAF5F0; border-radius: 12px; padding: 16px 20px; margin-top: 25px; display: table; width: 100%; box-sizing: border-box; }
          .contact-item { display: table-cell; vertical-align: middle; width: 50%; font-size: 12px; color: #4A5568; }
          .contact-item strong { color: #6B1527; display: block; margin-bottom: 3px; }
          .footer { background: #FAF5F0; padding: 22px; text-align: center; font-size: 11px; color: #718096; border-top: 1px solid #F3E7E4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="emblem">✦ ❖ ✦</div>
            <h1 class="brand">Eternal Vastra</h1>
            <div class="tagline">Elegance Eternal • Handcrafted Sarees</div>
          </div>
          <div class="body">
            <div class="greeting">Namaste ${fullName},</div>
            <p class="paragraph">
              Thank you for contacting <strong>Eternal Vastra</strong>. We have received your inquiry regarding <em>"${inquirySubject}"</em>.
            </p>
            <p class="paragraph">
              Our luxury saree consultants and customer care team are reviewing your message. We strive to provide personal attention to every client and we will get back to you within <strong>24 hours</strong>.
            </p>

            <div class="summary-box">
              <div class="summary-title">Summary of Your Message:</div>
              <div class="summary-text">"${message}"</div>
            </div>

            <div class="contact-bar">
              <div class="contact-item">
                <strong>Direct Phone</strong>
                +91 98564 75612<br/>(Mon - Sat: 10:00 AM - 7:00 PM)
              </div>
              <div class="contact-item">
                <strong>Email Support</strong>
                support@eternalvastra.com<br/>Mumbai Flagship Studio
              </div>
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Eternal Vastra. All rights reserved.<br/>
            Pure Silk • Handloom Cottons • Royal Paithanis • Designer Couture
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const transporter = getTransporter();

    // Send both Admin notification and Customer Confirmation concurrently in parallel
    const [adminResult, customerResult] = await Promise.allSettled([
      transporter.sendMail({
        from: fromEmail,
        to: adminEmail,
        replyTo: email,
        subject: `[Contact Form] ${inquirySubject} - From ${fullName}`,
        html: adminHtml,
      }),
      transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: `We've received your message - Eternal Vastra`,
        html: customerHtml,
      }),
    ]);

    const adminSent = adminResult.status === "fulfilled";
    const customerSent = customerResult.status === "fulfilled";

    if (adminSent) {
      console.log(`[MAILER] Contact inquiry email delivered to Admin (${adminEmail}) from ${email}`);
    } else {
      console.warn(`[MAILER] Admin email delivery warning: ${adminResult.reason?.message}`);
    }

    if (customerSent) {
      console.log(`[MAILER] Customer confirmation email delivered to ${email}`);
    } else {
      console.warn(`[MAILER] Customer confirmation email warning: ${customerResult.reason?.message}`);
    }

    return {
      success: adminSent || customerSent,
      results: { adminSent, customerSent },
    };
  } catch (err) {
    console.warn(`[MAILER] Error creating transporter or sending contact mail: ${err.message}`);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendOtpEmail,
  sendContactEmail,
};
