// utils/utils.js
import jwt from 'jsonwebtoken';

// Generate a JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret', // Use environment variable for security
    {
      expiresIn: '30d',
    }
  );
};