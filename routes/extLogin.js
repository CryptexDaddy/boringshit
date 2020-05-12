var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('extLogin', { title: 'Legit Casino' });
  
});

module.exports = router;
