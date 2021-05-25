const mongoose = require('mongoose');
const { Schema } = mongoose;
const Post = require('./post');

const commentSchema = new Schema({
    comment:{
        type:String,
        required: [true, 'Comment cannot be empty required']
    },
    posts:{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }

})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;