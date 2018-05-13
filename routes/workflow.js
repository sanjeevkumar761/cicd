var express = require('express');
var router = express.Router();
var wfc = require('../controllers/workflow');

// Provess workflows and actions
router.get('/', wfc.workflowlist);
router.get('/:action', wfc.event);
router.post('/:action', wfc.event);

module.exports = router;





