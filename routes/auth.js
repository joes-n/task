const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

// Register page
router.get('/register', ensureGuest, (req, res) => {
  res.render('register', { title: 'Register' });
});

// Register handler
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register',
        error: 'Passwords do not match',
        username,
        email
      });
    }

    if (password.length < 6) {
      return res.render('register', {
        title: 'Register',
        error: 'Password must be at least 6 characters',
        username,
        email
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('register', {
        title: 'Register',
        error: 'User with this email or username already exists',
        username,
        email
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Auto-login after registration
    req.session.userId = user._id;
    res.redirect('/tasks');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', {
      title: 'Register',
      error: 'Registration failed. Please try again.'
    });
  }
});

// Login page
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', { title: 'Login' });
});

// Login handler
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid email or password',
        email
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', {
        title: 'Login',
        error: 'Invalid email or password',
        email
      });
    }

    // Set session
    req.session.userId = user._id;
    res.redirect('/tasks');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login',
      error: 'Login failed. Please try again.'
    });
  }
});

// Logout page (with countdown)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/tasks');
    }
    res.render('logout', { title: 'Logged Out', countdown: 3 });
  });
});

// Logout handler (POST - for form submissions)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/tasks');
    }
    res.redirect('/login');
  });
});

module.exports = router;
