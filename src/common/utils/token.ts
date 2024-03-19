import * as jwt from 'jsonwebtoken';

const TOKEN_KEY = '12433whrrtjgh';
const TOKEN_EXPIRY = '2d';

export const createToken = (payload) => {
  return jwt.sign(payload, TOKEN_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
  return jwt.verify(token, TOKEN_KEY);
};
