var express = require('express');
var fs = require('fs');
var router = express.Router();
var uuid = require('node-uuid');
var Article = require('../api/article/article.model');

/* GET home page. */

//前台渲染路由
router.get('/',function(req,res,next){
  Article.findAsync()
      .then(function(data){
        res.render('articlelist', { articles: data});
      })

})
router.get('/detail/:id', function(req, res, next) {
  Article.findByIdAsync(req.params.id)
      .then(function(data){
         res.render('detail', data);
      })
});
router.get('/add',function(req,res,next){
  res.render('add');
})
//文章路由
router.use('/api/article',require('../api/article'));

module.exports = router;
