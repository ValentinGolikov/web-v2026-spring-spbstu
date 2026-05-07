const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const USERS_PATH = path.join(__dirname, '../data/users.json');
const TOKEN_SECRET = 'gadget-hub-secret-2026';

// Simple token: base64(login:secret)
const generateToken = (login) =>
  Buffer.from(`${login}:${TOKEN_SECRET}`).toString('base64');

const verifyToken = (token) => {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [login, secret] = decoded.split(':');
    if (secret === TOKEN_SECRET) return login;
    return null;
  } catch {
    return null;
  }
};

router.post('/', (req, res) => {
  const { login, password } = req.body || {};

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
    const user = users.find(
      (u) => u.login === login && u.password === password
    );

    if (user) {
      const token = generateToken(user.login);
      return res.json({
        success: true,
        token,
        user: { login: user.login, name: user.name },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = { router, verifyToken };
