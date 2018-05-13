var express = require('express');
var router = express.Router();
var appcontroller = require('../controllers/apps');

// Handle requests to apps
router.get('/', appcontroller.applist);
//router.get('/:id', appsInfo);
router.get('/add', appcontroller.appadd);
router.get('/:id/remove', appcontroller.appremove);
router.get('/:id/start', appcontroller.appstart);
router.get('/:id/stop', appcontroller.appstop);

module.exports = router;





