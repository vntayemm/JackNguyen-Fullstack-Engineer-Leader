import { verifyToken } from '../utils/jwt.js';
import User from '../models/user.js';

export async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    req.user = await User.findByPk(payload.id);
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
} 