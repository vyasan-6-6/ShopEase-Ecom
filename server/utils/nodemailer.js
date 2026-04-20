const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
 service: 'gmail',
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMPT_PORT) || 465, // or 587 false
  secure: process.env.SMPT_PORT===465 // true, 
  , 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },pool:true,
  tls:{rejectUnauthorized:false}//for dev only
});
const sendOtpEmail = async (email, otp, type = "verification") => {
  const isReset = type === "reset";
  const subject = isReset ? "Reset Your Password - ShopEase" : "Verify Your Account - ShopEase";
  const title = isReset ? "Password Reset Request" : "Account Verification";
  const message = isReset 
    ? "You requested to reset your password. Use the following code to proceed:" 
    : "Thank you for joining ShopEase! Please use the following code to verify your account:";

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">${title}</h2>
        <p style="color: #374151; font-size: 16px;">${message}</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; font-size: 32px; margin: 0; color: #111827;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This code is valid for 10 minutes. If you did not request this email, please ignore it.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; 2026 ShopEase E-commerce. Premium Shopping Experience.</p>
      </div>
    `
  });
};
module.exports={sendOtpEmail};
