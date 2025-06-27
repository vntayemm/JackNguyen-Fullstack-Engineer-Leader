import nodemailer from 'nodemailer';
import config from '../config.js';

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  }
});

export async function sendMail({ to, subject, html }) {
  try {
    console.log('Attempting to send email to:', to);
    console.log('Using email config:', {
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      user: config.EMAIL_USER,
      from: config.EMAIL_FROM
    });
    
    const result = await transporter.sendMail({
      from: config.EMAIL_FROM,
      to,
      subject,
      html
    });
    
    console.log('✅ Email sent successfully:', {
      to,
      subject,
      messageId: result.messageId
    });
    
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', {
      to,
      subject,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
} 