// Auth routes using Mongo User model + cookie-based JWT
const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'sid';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ msg: 'Missing credentials' });
    }
    const user = await User.findOne({ username, isActive: true });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ msg: 'Invalid credentials' });

    const payload = { sub: user._id.toString(), role: user.role, usr: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '20m' });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 20 * 60 * 1000
    });

    user.lastLoginAt = new Date();
    await user.save();

    res.json({ ok: true, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/me', (req, res) => {
  try {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ msg: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ ok: true, user: { id: payload.sub, username: payload.usr, role: payload.role } });
  } catch (err) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

module.exports = router;
