'use strict';

var express = require('express');
var controller = require('./hubspot.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/contacts', controller.createContacts);
router.post('/properties', controller.createProperties);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
