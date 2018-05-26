var express = require('express');
var router = express.Router();
var ac = require('../controllers/apps');

// Handle requests to apps
router.get('/', ac.applist);
router.get('/list', ac.applistcontrol);
router.post('/add', ac.appadd);
router.patch('/:id/start', ac.appstart);
router.patch('/:id/stop', ac.appstop);
router.delete('/:id/remove', ac.appremove);
router.put('/:id', ac.appupdate);

module.exports = router;
