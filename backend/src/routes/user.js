import express from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.delete('/delete-account', auth, deleteAccount);

export default router; 