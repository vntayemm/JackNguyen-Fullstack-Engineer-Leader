import { verifyEmail, registerUser, loginUser, forgotPassword, resetPassword, getProfile, updateProfile } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const verifyEmailToken = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await verifyEmail(token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPasswordHandler = async (req, res) => {
  try {
    const result = await forgotPassword(req.body.email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await resetPassword(token, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfileHandler = async (req, res) => {
  try {
    const result = await getProfile(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfileHandler = async (req, res) => {
  try {
    const result = await updateProfile(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 