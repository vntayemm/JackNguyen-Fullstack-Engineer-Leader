import jwt from 'jsonwebtoken';
import config from '../config.js';

const SECRET = config.JWT_SECRET;
export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: config.JWT_EXPIRES_IN });
export const verifyToken = (token) => jwt.verify(token, SECRET); 