var express = require('express');
var router = express.Router();
var ac = require('../controllers/apps');

// Handle requests to apps
// The API should be described in swagger
router.get('/', ac.applist);
router.post('/', ac.appadd);
router.get('/list', ac.applistcontrol);
router.put('/:id', ac.appupdate);
router.delete('/:id', ac.appremove);
router.patch('/:id/start', ac.appstart);
router.patch('/:id/stop', ac.appstop);



module.exports = router;
