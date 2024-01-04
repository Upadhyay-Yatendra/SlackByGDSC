const nodemailer = require('nodemailer');

async function sendEmail(to, subject, html, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendEmail;
