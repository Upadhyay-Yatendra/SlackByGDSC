// import nodemailer from "nodemailer";
// import smtpTransport from "nodemailer-smtp-transport";
// import { google } from "googleapis";
// import dotenv from "dotenv";
// dotenv.config();
// // Create OAuth2 client with refresh token
// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );
// oAuth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });

// async function sendEmail(to, subject, html, text) {
//   try {
//     // console.log("refresh token", process.env.GOOGLE_REFRESH_TOKEN)
//     // Get access token using OAuth2 client
//     const accessToken = await oAuth2Client.getAccessToken();

//     // Create a transporter using SMTP transport with OAuth 2.0
//     const transporter = nodemailer.createTransport(
//       smtpTransport({
//         service: "gmail",
//         auth: {
//           type: "OAuth2",
//           user: process.env.SMTP_USERNAME, // Your Gmail email address
//           clientId: process.env.GOOGLE_CLIENT_ID, // Your OAuth 2.0 client ID
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your OAuth 2.0 client secret
//           refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Your OAuth 2.0 refresh token
//           accessToken: accessToken, // Your OAuth 2.0 access token
//         },
//       })
//     );

//     // Send email
//     await transporter.sendMail({
//       from: process.env.SMTP_USERNAME,
//       to,
//       subject,
//       html,
//       text: "hello from slack",
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// export default sendEmail;
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME, // Your Gmail email address
    pass: process.env.SMTP_PASSWORD, // Your Gmail app password
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    // console.log("\n\ntransporter:->",transporter)
    // console.log("\n\nuser->",process.env.SMTP_USERNAME);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error in sending email: " + error);
  }
}

export default sendEmail;
