import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { sendMail } from '../utils/mailer.js';
import config from '../config.js';
import crypto from 'crypto';

export async function verifyEmail(token) {
  const user = await User.findOne({ where: { verification_token: token } });
  
  if (!user) {
    throw new Error('Invalid or expired verification token');
  }
  
  if (user.is_verified) {
    throw new Error('Email already verified');
  }
  
  user.is_verified = true;
  user.verification_token = null;
  await user.save();
  
  return { message: 'Email verified successfully! You can now log in.' };
}

export async function registerUser(userData) {
  const { username, email, password } = userData;
  
  // Validation
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required');
  }
  
  if (username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  const password_hash = await hashPassword(password);
  const verification_token = crypto.randomBytes(32).toString('hex');
  
  const user = await User.create({ 
    username: username.trim(), 
    email: email.trim().toLowerCase(), 
    password_hash,
    verification_token,
    is_verified: false
  });
  
  // Send verification email
  const verificationLink = `${config.FRONTEND_URL}/verify-email?token=${verification_token}`;
  await sendMail({
    to: user.email,
    subject: 'Welcome to DNS/Email Security Tool - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to DNS/Email Security Tool!</h2>
        <p>Hi ${user.username},</p>
        <p>Thank you for registering with DNS/Email Security Tool. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The DNS/Email Security Tool Team</p>
      </div>
    `
  });
  
  return { 
    message: 'Registration successful! Please check your email to verify your account.',
    id: user.id, 
    username: user.username, 
    email: user.email 
  };
}

export async function loginUser(credentials) {
  const { username, password } = credentials;
  
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  if (!user.is_verified) {
    throw new Error('Please verify your email address before logging in. Check your email for the verification link.');
  }
  
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  
  const token = signToken({ id: user.id, username: user.username });
  return { 
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }
  };
}

export async function forgotPassword(email) {
  if (!email) {
    throw new Error('Email is required');
  }
  
  const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    // Don't reveal if email exists or not for security
    return { message: 'If an account with this email exists, a password reset link has been sent.' };
  }
  
  // Generate reset token
  const reset_token = crypto.randomBytes(32).toString('hex');
  const reset_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  user.reset_token = reset_token;
  user.reset_token_expires = reset_token_expires;
  await user.save();
  
  // Send password reset email
  const resetLink = `${config.FRONTEND_URL}/reset-password?token=${reset_token}`;
  await sendMail({
    to: user.email,
    subject: 'Reset Your Password - DNS/Email Security Tool',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>Hi ${user.username},</p>
        <p>We received a request to reset your password for your DNS/Email Security Tool account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${resetLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The DNS/Email Security Tool Team</p>
      </div>
    `
  });
  
  return { message: 'If an account with this email exists, a password reset link has been sent.' };
}

export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required');
  }
  
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  const user = await User.findOne({ 
    where: { 
      reset_token: token,
      reset_token_expires: { [require('sequelize').Op.gt]: new Date() }
    }
  });
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }
  
  // Update password and clear reset token
  user.password_hash = await hashPassword(newPassword);
  user.reset_token = null;
  user.reset_token_expires = null;
  await user.save();
  
  // Send confirmation email
  await sendMail({
    to: user.email,
    subject: 'Password Changed Successfully - DNS/Email Security Tool',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Password Changed Successfully</h2>
        <p>Hi ${user.username},</p>
        <p>Your password for DNS/Email Security Tool has been successfully changed.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The DNS/Email Security Tool Team</p>
      </div>
    `
  });
  
  return { message: 'Password updated successfully' };
}

export async function getProfile(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'created_at', 'is_verified']
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at,
    isVerified: user.is_verified
  };
}

export async function updateProfile(userId, updateData) {
  const { firstName, lastName } = updateData;
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update fields if provided
  if (firstName !== undefined) {
    user.first_name = firstName?.trim() || null;
  }
  if (lastName !== undefined) {
    user.last_name = lastName?.trim() || null;
  }
  
  await user.save();
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at,
    isVerified: user.is_verified
  };
} 