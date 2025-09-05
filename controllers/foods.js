const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');

    res.render('foods/index.ejs', { user, pantry: user.pantry });
  } catch (err) {
    console.error('Error loading pantry:', err);
    res.redirect('/');
  }
});

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


router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      console.error('User not found in session');
      return res.redirect('/');
    }

    user.pantry.push(req.body);
    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error adding food item:', err);
    res.redirect('/');
  }
});


router.get('/:itemId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');

    const foodItem = user.pantry.id(req.params.itemId);
    if (!foodItem) return res.redirect(`/users/${user._id}/foods`);

    res.render('foods/edit.ejs', { user, foodItem });
  } catch (err) {
    console.error('Error loading edit page:', err);
    res.redirect(`/users/${req.session.user._id}/foods`);
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/');

    const foodItem = user.pantry.id(req.params.itemId);
    if (!foodItem) return res.redirect(`/users/${user._id}/foods`);

   
    foodItem.name = req.body.name;
    foodItem.quantity = req.body.quantity;
    foodItem.category = req.body.category;
    foodItem.expirationDate = req.body.expirationDate;

    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error updating food item:', err);
    res.redirect(`/users/${req.session.user._id}/foods`);
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      console.error('User not found in session');
      return res.redirect('/');
    }

    user.pantry.id(req.params.itemId).remove();
    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error deleting food item:', err);
    res.redirect('/');
  }
});

module.exports = router;
