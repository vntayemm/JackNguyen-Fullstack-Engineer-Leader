import nodemailer from 'nodemailer';
import config from '../config.js';

const transporter = nodemailer.createTransporter({
  host: config.EMAIL_HOST,
  port: config.EMAIL_PORT,
  secure: config.EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  // Additional options for better compatibility
  pool: true,
  maxConnections: 1,
  maxMessages: 3
});

export async function sendMail({ to, subject, html }) {
  try {
    console.log('📧 Attempting to send email to:', to);
    console.log('📧 Using email config:', {
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_PORT === 465,
      user: config.EMAIL_USER,
      from: config.EMAIL_FROM
    });
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');
    
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
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // Don't throw error for email failures - just log them
    // This prevents registration from failing due to email issues
    console.warn('⚠️  Email sending failed, but registration will continue');
    return null;
  }
} 