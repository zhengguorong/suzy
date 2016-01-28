var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/',function(req,res,next){
  res.render('articlelist', { title: 'Suzy' });
})
router.get('/detail', function(req, res, next) {
  res.render('detail', { title: 'Suzy' });
});

module.exports = router;
