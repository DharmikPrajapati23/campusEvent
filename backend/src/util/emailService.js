

// const nodemailer = require("nodemailer");

// require("dotenv").config();
// const sendVerificationEmail = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
      
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Email Verification OTP",
//       html: `<p>Your Referal Code is : <strong>${otp}</strong> Referer 5 More People to obtain Full refund</p>`,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send verification email");
//   }
// };

// module.exports = sendVerificationEmail;




const nodemailer = require("nodemailer");

require("dotenv").config();
const sendVerificationEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `<p>Your Referal Code is : <strong>${otp}</strong> Referer 5 More People to obtain Full refund</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

module.exports = sendVerificationEmail;