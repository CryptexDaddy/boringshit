var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const {Task} = require('../models/task.model');
const {Company} = require('../models/company.model');

/* GET home page. */
router.get('/', async function(req, res, next) {
    // const new_comp = new Company({
    //     name: 'Caveman Inc',
    //     address: 'Ranczo Wypalanki 123',
    //     phone: '8 800 5553535',
    //     contact: 'support@timcock.com'
    // })
    // new_comp.save()
    res.render('tasks', { title: 'Manage Tasks' });
});

module.exports = router;
