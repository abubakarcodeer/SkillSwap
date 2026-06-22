const nodemailer = require('nodemailer');

module.exports = async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) {
    console.log('[email:dev]', { to, subject, html });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
};
