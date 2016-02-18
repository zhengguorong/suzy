var mongoose = require('bluebird').promisifyAll(require('mongoose'));


var ReplySchema = new mongoose.Schema({
    pId:String,
    location:String,
    author:String,
    content:String,
    createTime:String,
    displayTime:String,
})
module.exports = mongoose.model('Reply',ReplySchema);
