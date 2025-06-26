import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: '459a0c001@smtp-brevo.com',
    pass: '7qa84DCrOzITKtG5'
  }
});

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: 'Domain Validator <459a0c001@smtp-brevo.com>',
    to,
    subject,
    html
  });
} 