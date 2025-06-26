import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { sendMail } from '../utils/mailer.js';
import config from '../config.js';
import crypto from 'crypto';
import { Op } from 'sequelize';

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

export async function registerUser(registerDTO) {
  // DTO validation is already handled in controller
  const { username, email, password } = registerDTO;
  
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

export async function loginUser(loginDTO) {
  // DTO validation is already handled in controller
  const { username, password } = loginDTO;
  
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

export async function forgotPassword(forgotPasswordDTO) {
  // DTO validation is already handled in controller
  const { email } = forgotPasswordDTO;
  
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

export async function resetPassword(token, resetPasswordDTO) {
  // DTO validation is already handled in controller
  const { password } = resetPasswordDTO;
  
  const user = await User.findOne({ 
    where: { 
      reset_token: token,
      reset_token_expires: { [Op.gt]: new Date() }
    }
  });
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }
  
  // Update password and clear reset token
  user.password_hash = await hashPassword(password);
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
    attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'createdAt', 'is_verified']
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
    createdAt: user.createdAt,
    isVerified: user.is_verified
  };
}

export async function updateProfile(userId, updateProfileDTO) {
  // DTO validation and sanitization is already handled in controller
  const { firstName, lastName } = updateProfileDTO;
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update fields if provided
  if (firstName !== undefined) {
    user.first_name = firstName;
  }
  if (lastName !== undefined) {
    user.last_name = lastName;
  }
  
  await user.save();
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.createdAt,
    isVerified: user.is_verified
  };
}

export async function changePassword(userId, changePasswordDTO) {
  // DTO validation is already handled in controller
  const { oldPassword, newPassword } = changePasswordDTO;
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verify old password
  const validOldPassword = await comparePassword(oldPassword, user.password_hash);
  if (!validOldPassword) {
    throw new Error('Current password is incorrect');
  }
  
  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);
  
  // Update password
  user.password_hash = newPasswordHash;
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
  
  return { message: 'Password changed successfully' };
}

export async function deleteAccount(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Send goodbye email
  await sendMail({
    to: user.email,
    subject: 'Account Deleted - DNS/Email Security Tool',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Account Deleted</h2>
        <p>Hi ${user.username},</p>
        <p>Your DNS/Email Security Tool account has been successfully deleted.</p>
        <p>We're sorry to see you go. If you change your mind, you can always create a new account.</p>
        <p>Thank you for using our service.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The DNS/Email Security Tool Team</p>
      </div>
    `
  });
  
  // Delete user
  await user.destroy();
  
  return { message: 'Account deleted successfully' };
} 