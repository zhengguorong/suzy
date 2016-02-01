var mongoose = require('bluebird').promisifyAll(require('mongoose'));


var ArticleSchema = new mongoose.Schema({
    title:String,
    pic:String,
    location:String,
    author:String,
    content:String,
    createTime:{ type: Date, default: Date.now },
})
module.exports = mongoose.model('Article',ArticleSchema);
