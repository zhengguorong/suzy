/**
 * Created by monkey1990 on 16/2/18.
 */
var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var CounterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
})
module.exports = mongoose.model('counter',CounterSchema);
