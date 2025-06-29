import express from 'express';
import { 
  login, 
  register, 
  forgotPassword, 
  resetPassword, 
  verifyEmail
} from '../controllers/authController.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router; 