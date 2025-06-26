import express from 'express';
import { login, register, forgotPasswordHandler, resetPasswordHandler, verifyEmailToken, getProfileHandler, updateProfileHandler } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password/:token', resetPasswordHandler);
router.get('/verify-email/:token', verifyEmailToken);

// Protected routes
router.get('/profile', auth, getProfileHandler);
router.put('/profile', auth, updateProfileHandler);

export default router; 