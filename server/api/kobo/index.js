'use strict';

var express = require('express');
var controller = require('./kobo.controller');

var router = express.Router();

router.get('/form', controller.getForms);
router.get('/form/:id', controller.getFormById);
router.get('/data/:id', controller.getFormData);
router.post('/aggregated', controller.getAggregatedData);

module.exports = router;
