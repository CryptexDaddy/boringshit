var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model')
const {Task} = require('../models/task.model')

/* GET home page. */
router.get('/', async function(req, res, next) {
    const users_doc = await User.find({status: 1}).exec();
    const active_tasks = await Task.find({status: 1}).exec();
    res.render('dashboard', { title: 'Dashboard', active_users: users_doc, active_tasks });
});

module.exports = router;
