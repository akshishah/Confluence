const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const {postSchema} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressErrror = require('../utils/ExpressError');
const states = require('../seeds/states');

const validatePost = (req,res,next) =>{
    
    const {error} = postSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrror(msg,400);
    }
    else{
        next();
    }
}

router.get('/',async(req,res) =>{
    const posts = await Post.find({});
    res.render('posts/index', {posts} );
})

// new post
router.get('/new',(req,res) =>{
    res.render('posts/new',{states});
})
router.post('/',validatePost,async(req,res) =>{
    const post = new Post(req.body);
    await post.save();
    req.flash('success','New post created!')
    res.redirect('/posts');  
})

router.get('/:id',catchAsync(async(req,res,next) =>{
    const {id} = req.params;
    const post  = await Post.findById(id).populate('comments');
    if(!post){
        req.flash('error',"Sorry this post doesn't exist");
        res.redirect('/posts');
        
    }
    res.render('posts/show' , {post});   
}))
router.get('/:id/edit',catchAsync(async(req,res) =>{
    const {id} = req.params;
    const post =  await Post.findById(id);
    req.flash('success','Post updated!')
    res.render('posts/edit',{post,states});
}))

router.put('/:id',validatePost,async(req,res) =>{
    const {id} = req.params;
    const post =  await Post.findByIdAndUpdate(id,req.body);
    await post.save();
    res.redirect(`/posts/${id}`);
})

router.delete('/:id' , async(req,res) =>{
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash('success','Post Deleted')
    res.redirect('/posts');
})

module.exports = router;