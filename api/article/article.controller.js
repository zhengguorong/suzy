var _ = require('lodash');
var Article = require('./article.model');
var uuid = require('node-uuid');
var fs = require('fs');
var moment = require('moment');

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
                .spread(function(){return updated});
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
    res.body.createTime = new Date().getTime();
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
    Article.findAsync()
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
    if (req.body._id) {
        delete req.body._id;
    }
    Article.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(saveUpdates(req.body))
        .then(responseWithResult(res))
        .catch(handleError(res));
}

// Deletes a Thing from the DB
controller.destroy = function(req, res) {
    Article.findByIdAsync(req.params.id)
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

module.exports = controller;
