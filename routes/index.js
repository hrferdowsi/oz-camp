const express = require ('express');
let router = express.Router({mergeParams:true});
const passport = require('passport');
let User = require ('../models/user')
let middleware = require ('../middleware'); // we don't need to call index.js as it is by dafult set directory
var Notification = require("../models/notification");
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


// NOTIFICATION SETUP:

// user profile
router.get('/users/:id', async (req, res) => {
    try {
      let user = await User.findById(req.params.id).populate('followers').exec();
      res.render('profile', { user:user });
    } catch(err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
  });
  
  // follow user
  router.get('/follow/:id', middleware.isLoggedIn, async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      user.followers.push(req.user._id);
      user.save();
      req.flash('success', 'Successfully followed ' + user.username + '!');
      res.redirect('/users/' + req.params.id);
    } catch(err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  });
  
  // view all notifications
  router.get('/notifications', middleware.isLoggedIn, async (req, res) => {
    try {
      let user = await User.findById(req.user._id).populate({
        path: 'notifications',
        options: { sort: { "_id": -1 } }
      }).exec();
      let allNotifications = user.notifications;
      res.render('notifications/index', { allNotifications });
    } catch(err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  });
  
  // handle notification
  router.get('/notifications/:id', middleware.isLoggedIn, async (req, res) => {
    try {
      let notification = await Notification.findById(req.params.id);
      notification.isRead = true;
      notification.save();
      res.redirect(`/campgrounds/${notification.campgroundId}`);
    } catch(err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  });
  
  
  

module.exports = router;