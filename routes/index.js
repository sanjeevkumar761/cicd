var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Hack: CI CD Support 0.1.12' });
});

module.exports = router;
