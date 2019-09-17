
const express = require ('express');
let router = express.Router({mergeParams:true});
const Campground = require ('../models/campground');
const Comment = require ('../models/comment');
let middleware = require ('../middleware'); // we don't need to call index.js as it is by dafult set directory


// Comments Routes:
router.get('/new', middleware.isLoggedIn ,async(req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) { console.log(err); }
        else {
            res.render('comments/new', { campground: camp });
        }

    })
})

router.post('/', middleware.isLoggedIn,async(req, res) => {
    
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            Comment.create(req.body.comment, (err,comment) =>{
                if(err){
                    req.flash('error','something went wrong!')
                    console.log(err)
                }
                else{
                    // add username and id to the comment:
                    // console.log(`_id ${req.user}`);
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    camp.comments.push(comment); 
                    camp.save();
                    req.flash('success','successfully added comment');
                    res.redirect(`/campgrounds/${camp._id}`);
                }
            })
        }
    })
})

//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit',middleware.checkCommentOwnership, async(req,res)=>{
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit',{campground_id: req.params.id, comment: foundComment});
        }
    })
})

// UPDATE the comments edit route
router.put('/:comment_id',middleware.checkCommentOwnership,async(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, (err,updatedComment)=>{
        if(err){
            res.redirect('back')
        }
        else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership,async(req,res)=>{
    //find by ID and Remove
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect('back');
        }else{
            req.flash('success',"comment deleted");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
})


module.exports = router;