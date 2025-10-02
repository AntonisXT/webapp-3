const jwt = require('jsonwebtoken');
require('dotenv').config();

const COOKIE_NAME = 'sid';

module.exports = function auth(req, res, next) {
  const raw = req.header('Authorization') || '';
  let token = raw.startsWith('Bearer ') ? raw.slice(7) : (raw || '');
  if (!token && req.cookies) {
    token = req.cookies[COOKIE_NAME];
  }
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};
