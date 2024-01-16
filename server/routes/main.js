const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const userModel = require("../models/User");
const { model } = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');


passport.use(new localStrategy(userModel.authenticate()))


// Routes

// Get
// Home

router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple blog created with Nodejs, Express & MongoDB"
        }
        let perPage = 2;
        let page = req.query.page || 1;

        const posts = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = 9;
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            posts,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            isLoggedIn
        });
    } catch (error) {
        console.log(error);
    }
})

// Get
// Post

router.get('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById({ _id: id });
        const locals = {
            title: post.title,
            description: "Simple Blog"
        }
        res.render('post', { locals, post });
    } catch (error) {
        console.log(error);
    }
})

// Get
// Post searchterm

router.post('/search', async (req, res) => {
    const locals = {
        title: "Search",
        description: "Simple Blog"
    }
    try {
        const searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
        const posts = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });
        res.render('search', { locals, posts });
    } catch (error) {
        console.log(error);
    }
})





router.get('/about', (req, res) => {
    res.render('about');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.get('/login', (req, res) => {
    res.render('login');
});
router.post("/signup", (req, res, next) => {
    const data = new userModel({
        username: req.body.username,
        email: req.body.email
    })
    userModel.register(data, req.body.password)
        .then(function () {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/")
            })
        })
})
router.post('/login', passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
}), (req, res, next) => {
});
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } else {
            res.redirect('/login');
        }
    });
});
router.get("/createpost", isLoggedIn, (req, res) => {
    res.render('createpost')
})

router.post("/createblog", async (req, res) => {
    const user = await userModel.findOne({username: req.session.passport.user});
    const post = await Post.create({
        owner: user._id,
        title: req.body.title,
        content: req.body.content  
    })
    user.posts.push(post._id);
    await user.save();
    res.redirect("/");
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login")
  }
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