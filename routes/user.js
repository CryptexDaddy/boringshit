var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const passport = require('passport');
const argon2 = require('argon2');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.render('user', { title: 'Profile' });
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Sign Up' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login', failureFlash : true, message: req.flash('error') });
})

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

router.post('/signup', async (req, res) => {
  const existing_user = await User.findOne({ $or: [{username: req.body.username}, {email: req.body.email}]});
  if (existing_user) return res.status(400).send('User already exists.');
  const user = new User({
    username: req.body.username,
    password: await argon2.hash(req.body.password, {type: argon2.argon2id, memoryCost: 2**16, hashLength: 50}),
    email: req.body.email
  })
  user.save()
  .then(doc => res.redirect('/user/login'))
  .catch(err => res.status(400).send(err))
})

router.post('/login', passport.authenticate('local', {session: true, successRedirect: '/', failureFlash: true, failureRedirect: '/user/login'}));

module.exports = router;