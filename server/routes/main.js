const express = require('express');
const router = express.Router();
const Post = require("../models/Post");


// Routes

// Get
// Home

router.get('',  async (req,res)=>{
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple blog created with Nodejs, Express & MongoDB"
        }
        let perPage = 2;
        let page = req.query.page || 1;
        
        const posts = await Post.aggregate([{$sort: {createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = 9;
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

        res.render('index', { 
            locals, 
            posts,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    } catch (error) {
        console.log(error);
    }
})

// Get
// Post

router.get('/post/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const post = await Post.findById({_id: id });
        const locals = {
            title: post.title,
            description: "Simple Blog"
        }
        res.render('post', {locals, post});
    } catch (error) {
        console.log(error);
    }
})







router.get('/about', (req,res)=>{
    res.render('about');
});


// function insertPostData (){
//     Post.insertMany([
//         {
//             title: "Sample Title3",
//             content: "This is the content post3333"
//         },
//     ])
// }

// insertPostData();

module.exports = router;