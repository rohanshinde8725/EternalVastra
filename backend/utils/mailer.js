const nodemailer = require("nodemailer");

// Configure transporter using env or fallback
const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Default test / dev configuration
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal.pass",
    },
  });
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
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Eternal Vastra" <no-reply@eternalvastra.com>',
      to: toEmail,
      subject,
      html: htmlContent,
    });
    console.log(`[MAILER] OTP email successfully sent to ${toEmail} -> OTP: ${otp}`);
  } catch (err) {
    console.warn(`[MAILER] Email delivery notice for ${toEmail}: ${err.message}. OTP code: ${otp}`);
  }

  return { success: true, otp };
};

module.exports = {
  sendOtpEmail,
};
