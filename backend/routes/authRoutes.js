const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// ✅ POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log("➡️ Register endpoint hit with:", req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ User already exists with email:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });

    await user.save();
    console.log("✅ User saved successfully:", user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log("🔐 JWT Token generated:", token);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("➡️ Login attempt with:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log("✅ Login successful, token generated:", token);

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
