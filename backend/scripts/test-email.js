#!/usr/bin/env node

import { sendMail } from '../src/utils/mailer.js';
import config from '../src/config.js';

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  console.log('📧 Email config:', {
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: config.EMAIL_PORT === 465,
    user: config.EMAIL_USER,
    from: config.EMAIL_FROM
  });

  try {
    const result = await sendMail({
      to: 'test@example.com',
      subject: 'Test Email - DNS/Email Security Tool',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email</h2>
          <p>This is a test email to verify the email configuration.</p>
          <p>If you receive this email, the email service is working correctly.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The DNS/Email Security Tool Team</p>
        </div>
      `
    });

    if (result) {
      console.log('✅ Email test successful!');
      console.log('📧 Message ID:', result.messageId);
    } else {
      console.log('⚠️  Email test completed but email was not sent (this is expected behavior)');
    }
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

// Run the test
testEmail().catch(console.error); 