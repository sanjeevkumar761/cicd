var express = require('express');
var router = express.Router();
var ac = require('../controllers/apps');

// Handle requests to apps
router.get('/', ac.applist);
router.put('/add', ac.appadd);
router.patch('/:id/update', ac.appupdate);
router.patch('/:id/start', ac.appstart);
router.patch('/:id/stop', ac.appstop);
router.delete('/:id/remove', ac.appremove);

/*
updated to proper REST

router.get('/add', ac.appadd);
router.get('/:id/update', ac.appupdate);
router.get('/:id/remove', ac.appremove);
router.get('/:id/start', ac.appstart);
router.get('/:id/stop', ac.appstop);

*/

module.exports = router;





