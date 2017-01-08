var express = require('express');
var router = express.Router();
var Article = require('../api/article/article.model');
var Reply = require('../api/reply/reply.model');

/* GET home page. */

//前台渲染路由
router.get('/',function(req,res,next){
  Article.findAsync({},null,{sort: '-createTime',limit:30})
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
          Reply.findAsync({pId:req.params.id})
              .then(function(replies){
                  data["replies"]=replies||[];
                  res.render('detail', data);
              })
      })
});
router.get('/add',function(req,res,next){
  res.render('add');
})
router.get('/reply/:id',function(req,res,next){
    res.render('reply');
})
//文章路由
router.use('/api/article',require('../api/article'));
router.use('/api/reply',require('../api/reply'));

router.use('/file', require('../api/file'));

module.exports = router;
