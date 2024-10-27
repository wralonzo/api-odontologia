import jwt from 'jsonwebtoken';
import { secret } from '../config/config.js';

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No token provided'
    });
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      auth: false,
      message: 'Failed to authenticate token'
    });
  }
};

export default verifyToken;