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
const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <h2>Your OTP Code</h2>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    `
  });
};
module.exports={sendOtpEmail};
