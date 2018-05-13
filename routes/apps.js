var express = require('express');
var router = express.Router();
var ac = require('../controllers/apps');

// Handle requests to apps
router.get('/', ac.applist);
//router.get('/:id', appsInfo);
router.get('/add', ac.appadd);
router.get('/:id/remove', ac.appremove);
router.get('/:id/start', ac.appstart);
router.get('/:id/stop', ac.appstop);

module.exports = router;





