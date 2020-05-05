var express = require('express');
var router = express.Router();
const {User} = require('../models/user.model');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const team_members = await User.find({'company': req.user.company._id})
  res.render('team', { title: 'Team', team_members });
  
});

module.exports = router;
