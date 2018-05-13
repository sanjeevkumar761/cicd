var express = require('express');
var router = express.Router();
var wfc = require('../controllers/workflow');

// 
router.get('/', wfc.workflowlist);
router.get('/:action', wfc.event);

module.exports = router;





