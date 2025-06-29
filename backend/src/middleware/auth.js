import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import config from '../config.js';

export async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = await User.findByPk(payload.id);
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
} 