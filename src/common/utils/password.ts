import * as bcrypt from 'bcrypt';
const saltRounds = 2;

export const generateHash = (password) => {
  return bcrypt.hash(password, saltRounds);
};

export const compareHash = (hashedPassword, plainPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
