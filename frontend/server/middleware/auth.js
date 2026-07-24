const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sattva_secret_default_key_987654';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Malformed authorization token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired authorization token' });
  }
}

function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.userId = 'guest_user';
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.userId = 'guest_user';
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId || 'guest_user';
  } catch (error) {
    req.userId = 'guest_user';
  }
  next();
}

module.exports = { authMiddleware, optionalAuthMiddleware, JWT_SECRET };
