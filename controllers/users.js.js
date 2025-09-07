const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// INDEX — GET /users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index.ejs', { users });
  } catch (err) {
    console.error('Error loading users:', err);
    res.redirect('/');
  }
});

// SHOW — GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.redirect('/users');
    }
    res.render('users/show.ejs', { user });
  } catch (err) {
    console.error('Error loading user pantry:', err);
    res.redirect('/users');
  }
});

module.exports = router;
