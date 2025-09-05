const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

// INDEX — GET /users/:userId/foods
router.get('/', async (req, res) => {
  try {
    // 1. Find the current user from the session
    const user = await User.findById(req.session.user._id);

    if (!user) {
      console.error('User not found in session');
      return res.redirect('/');
    }

    // 2. Send pantry items to the view
    res.render('foods/index.ejs', { user, pantry: user.pantry });
  } catch (err) {
    console.error('Error loading pantry:', err);
    res.redirect('/');
  }
});

// NEW — GET /users/:userId/foods/new
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');

    res.render('foods/new.ejs', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// CREATE — POST /users/:userId/foods
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    if (!user) {
      console.error('User not found in session');
      return res.redirect('/');
    }

    user.pantry.push(req.body); // Add new food item
    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error adding food item:', err);
    res.redirect('/');
  }
});

module.exports = router;
