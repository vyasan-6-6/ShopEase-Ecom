const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  pool: true,
  tls: { rejectUnauthorized: false }
});
const sendOtpEmail = async (email, otp, type = "verification") => {
  const isReset = type === "reset";
  const subject = isReset ? "Reset Your Password - ShopEase" : "Verify Your Account - ShopEase";
  const title = isReset ? "Password Reset Request" : "Account Verification";
  const message = isReset 
    ? "You requested to reset your password. Use the following code to proceed:" 
    : "Thank you for joining ShopEase! Please use the following code to verify your account:";

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.SMTP_USER}>`,
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

const sendOrderStatusEmail = async (email, order, status) => {
  let subject = "";
  let title = "";
  let message = "";

  switch (status) {
    case "Placed":
      subject = `Order Confirmation - #${order._id}`;
      title = "Order Confirmed!";
      message = `Thank you for your purchase! Your order #${order._id} has been successfully placed.`;
      break;
    case "Delivered":
      subject = `Order Delivered - #${order._id}`;
      title = "Your order has arrived!";
      message = `Great news! Your order #${order._id} has been delivered successfully. We hope you enjoy your purchase!`;
      break;
    case "Cancelled":
      subject = `Order Cancelled - #${order._id}`;
      title = "Order Cancelled";
      message = `Your order #${order._id} has been cancelled. If a refund is applicable, it will be processed to your wallet shortly.`;
      break;
    case "Returned":
      subject = `Order Returned - #${order._id}`;
      title = "Return Processed";
      message = `Your return for order #${order._id} has been processed successfully. Your refund has been initiated to your wallet.`;
      break;
    default:
      return; 
  }

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">${title}</h2>
        <p style="color: #374151; font-size: 16px;">${message}</p>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #111827; font-weight: bold;">Order Total: ₹${order.totalAmount}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} ShopEase E-commerce.</p>
      </div>
    `
  });
};

module.exports={sendOtpEmail, sendOrderStatusEmail};
