import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, { 
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'is_verified', 'createdAt'] 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Transform the response to match frontend expectations
    const userProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isVerified: user.is_verified,
      createdAt: user.createdAt
    };
    
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { username, email, firstName, lastName } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update fields if provided
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (firstName !== undefined) user.first_name = firstName;
    if (lastName !== undefined) user.last_name = lastName;
    
    await user.save();
    
    // Return updated profile
    const updatedProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isVerified: user.is_verified,
      createdAt: user.createdAt
    };
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!await comparePassword(oldPassword, user.password_hash)) {
      return res.status(400).json({ error: 'Old password incorrect' });
    }
    
    user.password_hash = await hashPassword(newPassword);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
}

export async function deleteAccount(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await User.destroy({ where: { id: req.user.id } });
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
} 