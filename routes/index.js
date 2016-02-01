var express = require('express');
var router = express.Router();
var Article = require('../api/article/article.model');

/* GET home page. */

//前台渲染路由
router.get('/',function(req,res,next){
  Article.findAsync({},null,{sort: '-createTime'})
      .then(function(data){
        res.render('articlelist', { articles: data});
      })

})
router.get("/mon/:date",function(req,res,next){
    var startTime = new Date(req.params.date).getTime();
    var endTime = startTime+60*60*1000*24*31;
    Article.findAsync({createTime:{"$gt":startTime,"$lte":endTime}})
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
