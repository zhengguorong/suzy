var multiparty = require('multiparty');
var fs = require('fs');

var controller = {};

controller.upload = function (req, res) {
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({ uploadDir: './public/upload/' });
  //上传完成后处理
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.send(500, 'parse error: ' + err);
    } else {
      res.status(200).send(files);
    }
  })
}

module.exports = controller;