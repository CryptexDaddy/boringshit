var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
const {Task} = require('../models/task.model');
const {Company} = require('../models/company.model')
const moment = require('moment');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const days_arr = {};
    const selected_week = moment((req.user.time_windows.length ? req.user.time_windows.slice(-1)[0].shift_start : Date.now()) - 518400000).format('MMMM d, YYYY') + ' - ' + moment(req.user.time_windows.length ? req.user.time_windows.slice(-1)[0].shift_start : Date.now()).format('MMMM d, YYYY')
    for (let window of req.user.time_windows.filter(val => val.shift_start > moment().subtract('7', 'days').valueOf())) {
        const work_time = (!window.shift_end ? Date.now() : window.shift_end) - window.shift_start
        const lunch_time = (!window.lunch_end && window.lunch_start ? window.shift_end ? window.shift_end : Date.now() : window.lunch_end) - window.lunch_start
        const total_time = (work_time - lunch_time)/3600000;
        if (days_arr[moment(window.shift_start).isoWeekday()]) days_arr[moment(window.shift_start).isoWeekday()]+=total_time
        else days_arr[moment(window.shift_start).isoWeekday()] = total_time
        // console.log(moment(window.shift_start - 518400000).format('dddd'));
    }
    res.render('hours', { title: 'Hour Overview', days_arr, selected_week });
    console.log(Object.keys(days_arr).length)
});

module.exports = router;

