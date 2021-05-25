const express = require('express');
const router = express.Router({mergeParams : true});
const Comment = require('../models/comment');
const Post = require('../models/post');
const {commentSchema , postSchema } = require('../schemas')
const states = require('../seeds/states');
const catchAsync = require('../utils/catchAsync');
const ExpressErrror = require('../utils/ExpressError');


const validateComment = (req,res,next) =>{
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}



router.post('/',validateComment,catchAsync(async (req,res) =>{
    const {id} = req.params;
    const post = await Post.findById(id);
    const comment = new Comment(req.body);
    post.comments.push(comment);
    comment.posts = post;
    await post.save();
    await comment.save();
    req.flash('success','Posted a new comment')
    res.redirect(`/posts/${id}`);
}))

router.delete('/:commentId' , catchAsync(async(req,res) =>{
    const { id,commentId} = req.params;
    await Post.findByIdAndUpdate(id,{$pull: { comments: commentId}});
    await Comment.findByIdAndDelete(commentId);
    req.flash('success','Comment Deleted')
    res.redirect(`/posts/${id}`);
}))

module.exports = router;