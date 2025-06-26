import User from '../models/user.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

export async function getProfile(req, res) {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'email', 'createdAt'] });
  res.json(user);
}
export async function updateProfile(req, res) {
  const { username, email } = req.body;
  const user = await User.findByPk(req.user.id);
  user.username = username || user.username;
  user.email = email || user.email;
  await user.save();
  res.json({ message: 'Profile updated' });
}
export async function changePassword(req, res) {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!await comparePassword(oldPassword, user.password_hash)) {
    return res.status(400).json({ error: 'Old password incorrect' });
  }
  user.password_hash = await hashPassword(newPassword);
  await user.save();
  res.json({ message: 'Password changed' });
}
export async function deleteAccount(req, res) {
  await User.destroy({ where: { id: req.user.id } });
  res.json({ message: 'Account deleted' });
} 