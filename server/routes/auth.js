const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { signToken } = require('../lib/jwt');
const { validateRegister, validateLogin } = require('../lib/validate-user');
const { protect } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existing = await User.findOne({ email: req.body.email });
  if (existing) return res.status(400).send('Email already registered.');

  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const token = signToken(user._id);

    res.status(201).send({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) return res.status(401).send('Invalid email or password.');

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(401).send('Invalid email or password.');

    const token = signToken(user._id);

    res.send({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/me', protect, (req, res) => {
  res.send(req.user);
});

module.exports = router;