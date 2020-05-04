var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const {Task} = require('../models/task.model');
const {Company} = require('../models/company.model');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const tasks = await Task.find({}).populate('employees').exec()
    // const new_comp = new Company({
    //     name: 'Caveman Inc',
    //     address: 'Ranczo Wypalanki 123',
    //     phone: '8 800 5553535',
    //     contact: 'support@timcock.com'
    // })
    // new_comp.save()
    // const task = await Task.findOne({}).exec()
    // const user = await User.findOne({}).exec()
    // task.employees.push(user._id)
    // task.save()
    res.render('tasks', { title: 'Manage Tasks', tasks });
});

module.exports = router;
