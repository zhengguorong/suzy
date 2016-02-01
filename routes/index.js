var express = require('express');
var fs = require('fs');
var router = express.Router();
var uuid = require('node-uuid');

/* GET home page. */

//前台渲染路由
router.get('/',function(req,res,next){
  res.render('articlelist', { title: 'Suzy' });
})
router.get('/detail', function(req, res, next) {
  res.render('detail', { title: 'Suzy' });
});
router.get('/add',function(req,res,next){
  res.render('add');
})
router.post('/upload',function(req,res,next){
  //接收前台POST过来的base64
  var imgData = req.body.fileData;
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64');
  var imagePath = "public/upload/"+uuid.v1()+".png";
  fs.writeFile(imagePath, dataBuffer, function(err) {
    if(err){
      res.send(err);
    }else{
      res.status(200).send({state:"success",msg:"保存成功!"});
    }
  });
})
//文章路由
router.use('/api/article',require('../api/article'));

module.exports = router;
