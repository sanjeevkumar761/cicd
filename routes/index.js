var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'CI CD Support 0.1.10' });
});

module.exports = router;
