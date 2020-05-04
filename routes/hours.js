var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const {Task} = require('../models/task.model');
const moment = require('moment');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const days_arr = {};
    const selected_week = moment(req.user.time_windows.slice(-1)[0].shift_start - 518400000).format('MMMM d, YYYY') + ' - ' + moment(req.user.time_windows.slice(-1)[0].shift_start).format('MMMM d, YYYY')
    for (let window of req.user.time_windows.slice(-8)) {
        const total_time = (window.shift_end-window.shift_start - (window.lunch_end-window.lunch_start))/3600000
        if (days_arr[moment(window.shift_start).isoWeekday()]) days_arr[moment(window.shift_start).isoWeekday()]+=total_time
        else days_arr[moment(window.shift_start).isoWeekday()] = total_time
        // console.log(moment(window.shift_start - 518400000).format('dddd'));
    }
    const users_doc = await User.find({status: 1}).exec();
    const active_tasks = await Task.find({status: 1}).exec();
    res.render('hours', { title: 'Hour Overview', active_users: users_doc, days_arr, selected_week });
    console.log(days_arr)
});

module.exports = router;