var _ = require('lodash');
var Article = require('./article.model');
var uuid = require('node-uuid');
var fs = require('fs');
var moment = require('moment');
var Reply = require('../reply/reply.model');

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

function responseWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if (entity) {
            res.status(statusCode).json(entity);
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function saveUpdates(updates) {
    return function(entity) {
        var updated = _.merge(entity, updates);
        return updated.saveAsync()
                .spread(function(){console.log(updated);return updated});
};
}

function removeEntity(res) {
    return function(entity) {
        if (entity) {
            return entity.removeAsync()
                .then(res.status(204).end());
    }
};
}

var controller={};
controller.getByDate = function(req,res){
    var startTime = new Date(req.params.date).getTime();
    var endTime = startTime+60*60*1000*24*31;
    Article.findAsync({createTime:{"$gt":startTime,"$lte":endTime}})
        .then(responseWithResult(res))
        .catch(handleError(res));
}
controller.getDetail=function(req,res){
    var result={}
    Article.findByIdAsync(req.params.id)
        .then(function(data){
            result.article=data;
            Reply.findAsync({pId:req.params.id})
                .then(function(replies){
                    result["replies"]=replies||[];
                    res.send(result);

                })
        })
}
controller.create = function(req,res){
    //接收前台POST过来的base64
    var imgData = req.body.fileData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var fileName = uuid.v1()+".png";
    var imagePath = "public/upload/"+fileName;
    req.body.pic = "/upload/"+fileName;
    req.body.displayTime = moment().format("MMM DD,YYYY");
    req.body.createTime = new Date().getTime();
    fs.writeFile(imagePath, dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            Article.createAsync(req.body)
                .then(responseWithResult(res, 201))
                .catch(handleError(res));
        }
    });

}
// Gets a list of Articles
controller.index = function(req, res) {
    var page = req.query.page||1;
    var count = req.query.count||5;
    var skip = (page-1)*count;
    Article.findAsync({},null,{sort: '-createTime',skip:parseInt(skip),limit:parseInt(count)})
        .then(responseWithResult(res))
        .catch(handleError(res));
}
// Gets a single Thing from the DB
controller.show = function(req, res) {
    Article.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(responseWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Thing in the DB
controller.update = function(req, res) {
        //接收前台POST过来的base64
    var imgData = req.body.fileData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var fileName = uuid.v1()+".png";
    var imagePath = "public/upload/"+fileName;
    req.body.pic = "/upload/"+fileName;
    if (req.body._id) {
        delete req.body._id;
    }
    fs.writeFile(imagePath, dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
        Article.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(responseWithResult(res))
        .catch(handleError(res));
        }
    })

}

// Deletes a Thing from the DB
controller.destroy = function(req, res) {
    Article.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

module.exports = controller;
