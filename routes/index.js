const express = require ('express');
let router = express.Router({mergeParams:true});
const passport = require('passport');
let User = require ('../models/user')
// const Campground = require ('../models/campground');
// const Comment = require ('../models/comment');



router.get('/', async(req, res) => {
    res.render('landing');
})

// ===
//Auth Routes
router.get('/register',async(req,res)=>{
    res.render('register');
})
// This route wiil handle sign up logic
router.post('/register',async(req,res)=>{
    let newUser=new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if (err){
            req.flash('error',err.message);
            return res.render('/register')
        }
        passport.authenticate('local')(req,res,()=>{
            req.flash('success',`welcome to YelpCamp ${user.username}`);            
            res.redirect('/campgrounds');
        })
    });
})
// show  login form
router.get('/login', async(req, res)=>{
res.render('login');

})
// handling login post
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
    }),async(req,res)=>{
})


// logout rout
router.get('/logout',async(req,res)=>{
    req.logout();
    req.flash('success','You are successfully Logged out');
    res.redirect('/campgrounds');
})


module.exports = router;