var mongoose = require('bluebird').promisifyAll(require('mongoose'));


var ArticleSchema = new mongoose.Schema({
    title:String,
    pic:String,
    location:String,
    author:String,
    content:String,
    createTime:{ type: String, default: new Date().getTime() },
    displayTime:String,
    commentCount:{ type: Number, default:0},
})
module.exports = mongoose.model('Article',ArticleSchema);
