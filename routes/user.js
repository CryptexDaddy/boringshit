var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const {Task} = require('../models/task.model');
const {Event} = require('../models/event.model');
const passport = require('passport');
const argon2 = require('argon2');
const {isAuthorized} = require('../middleware/authorize')

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
  res.redirect('/user/login');
})

router.put('/shift', async (req, res, next) => {
  console.log(req.body.type)
  const found_user = await User.findOne({_id: req.user._id});
  if (found_user) {

    switch (req.body.type) {
      case 'in':
        if (found_user.time_windows.length && found_user.time_windows[found_user.time_windows.length - 1].shift_end === 0) return res.sendStatus(400)
        else {
          found_user.time_windows.push({shift_start: Date.now()});
          found_user.status = 1;
        }
        break;
      case 'out':
        found_user.time_windows[found_user.time_windows.length - 1].shift_end = Date.now()
        if (found_user.time_windows[found_user.time_windows.length - 1].lunch_start && !found_user.time_windows[found_user.time_windows.length - 1].lunch_end) found_user.time_windows[found_user.time_windows.length - 1].lunch_end = Date.now()
        found_user.status = 0;
        break;
      case 'lunch':
        if (found_user.time_windows[found_user.time_windows.length - 1].lunch_start === 0 ) {
          found_user.time_windows[found_user.time_windows.length - 1].lunch_start = Date.now();
          found_user.status = 2;
        }
        else {
          found_user.time_windows[found_user.time_windows.length - 1].lunch_end = Date.now()
          found_user.status = 1;
        }
        break;
      default: return res.sendStatus(400);
    }
    found_user.save().then(doc => res.send(doc)).catch(err => res.send(err))
  }
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

router.post('/login', passport.authenticate('local', {session: true, successRedirect: '/dashboard', successFlash: 'Welcome back!', failureFlash: true, failureRedirect: '/user/login'}));

router.put('/tasks/update', isAuthorized, async (req,res,next) => {
  if (!req.body.length) return res.sendStatus(400);
  const promises = []
  for (let entry of req.body) {
    const task = await Task.findOne({_id: entry.id}).exec()
    if (!task) continue
    task.title=entry.title
    task.time_alloted.task_start = Date.parse(entry.task_start)
    task.time_alloted.task_end = Date.parse(entry.task_end)
    task.status = Number(entry.status)
    promises.push(task.save())
    // task.save().then(doc => res.send(doc)).catch(err => res.send(err))
  }
  Promise.all(promises).then(doc => res.send(doc)).catch(err => res.send(err))
})
router.post('/tasks/create', isAuthorized, async (req,res,next)=>{
  if (!Object.keys(req.body).length) return res.sendStatus(400);
  const new_task = new Task({
    title: req.body.title,
    "time_alloted.task_start": Date.parse(req.body["task-start"]),
    status: Number(req.body.status),
    "time_alloted.task_end": Date.parse(req.body['task-end'])
  })
  new_task.save().then(() => res.redirect('/tasks')).catch(err => res.send(err))
})
router.put('/tasks/delete', isAuthorized, async (req,res,next)=>{
  if (!Object.keys(req.body).length) return res.sendStatus(400);
  Task.deleteMany({_id: {$in: req.body}}).then(() => res.redirect('/tasks')).catch(err => res.send(err))
})
router.put('/hours/submit', async (req,res,next) => {
  if (!req.body.length) return res.sendStatus(400);
  const user = await User.findOne({_id: req.user.id}).exec()
  const matches = user.time_windows.filter(val => req.body.includes(val._id.toHexString()) && val.status === 0)
  if (!matches.length) return res.send('No entries matching the query');
  for (let val of matches) {
    user.time_windows[user.time_windows.indexOf(val)].status = Math.floor(Math.random() * Math.floor(3))
  }
  user.save().then(doc => res.send(doc)).catch(err => res.send(err))
})
router.put('/events/update', isAuthorized, async (req,res,next) => {
  if (!req.body.length) return res.sendStatus(400);
  const promises = []
  for (let entry of req.body) {
    const event = await Event.findOne({_id: entry.id}).exec()
    if (!event) continue
    event.title=entry.title
    event.time_alloted.task_start = Date.parse(entry.task_start)
    event.time_alloted.task_end = Date.parse(entry.task_end)
    promises.push(event.save())
    // event.save().then(doc => res.send(doc)).catch(err => res.send(err))
  }
  Promise.all(promises).then(doc => res.send(doc)).catch(err => res.send(err))
})
router.post('/events/create', isAuthorized, async (req,res,next)=>{
  if (!Object.keys(req.body).length) return res.sendStatus(400);
  const new_event = new Event({
    title: req.body.title,
    "time_alloted.task_start": Date.parse(req.body["task-start"]),
    "time_alloted.task_end": Date.parse(req.body['task-end'])
  })
  new_event.save().then(() => res.redirect('/calendar')).catch(err => res.send(err))
})
router.put('/events/delete', isAuthorized, async (req,res,next)=>{
  if (!Object.keys(req.body).length) return res.sendStatus(400);
  Event.deleteMany({_id: {$in: req.body}}).then(() => res.redirect('/calendar')).catch(err => res.send(err))
})
module.exports = router;