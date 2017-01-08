'use strict';

var express = require('express');
var controller = require('./file.controller');

var router = express.Router();

router.post('/upload', controller.upload);
router.get('/upload',function(req, res){
  res.render('upload')
})

module.exports = router;
