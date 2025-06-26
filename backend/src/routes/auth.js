import express from 'express';
import { 
  login, 
  register, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  getProfile, 
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes (authentication required)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.delete('/delete-account', auth, deleteAccount);

export default router; 