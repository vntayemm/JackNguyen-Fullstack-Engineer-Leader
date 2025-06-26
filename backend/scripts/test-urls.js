import config from '../src/config.js';

console.log('Testing Frontend URL Configuration...');
console.log('=====================================');

console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('FRONTEND_URL from config:', config.FRONTEND_URL);

// Test verification link generation
const testToken = 'test-verification-token-123';
const verificationLink = `${config.FRONTEND_URL}/verify-email?token=${testToken}`;
console.log('\nVerification Link:', verificationLink);

// Test reset password link generation
const resetToken = 'test-reset-token-456';
const resetLink = `${config.FRONTEND_URL}/reset-password?token=${resetToken}`;
console.log('Reset Password Link:', resetLink);

console.log('\nEnvironment URLs:');
console.log('- Development:', 'http://localhost:3000');
console.log('- Production:', 'https://domain-validator-service-533675451276.asia-southeast1.run.app');

console.log('\nURL Configuration Test Complete!'); 