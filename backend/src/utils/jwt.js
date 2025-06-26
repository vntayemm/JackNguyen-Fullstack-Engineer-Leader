import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'SECRET';
export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '1d' });
export const verifyToken = (token) => jwt.verify(token, SECRET); 