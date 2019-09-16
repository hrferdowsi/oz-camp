let Campground = require('../models/campground');
let Comment = require('../models/comment');

//all the middlewared goes here.
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        // does user own the campground?
        Campground.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                req.flash('error','Campground Not Found!')
                res.redirect("back");
            } else {
                 // To check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if (!foundCamp) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // does the user own the campground?
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error',"You Don't have permission to do that");
                    res.redirect("back");
                };
            };
        });
    } else {
        req.flash('error','You Need To Be Logged In');
        res.redirect("back");
    };
};


middlewareObj.checkCommentOwnership = (req, res, next) => {
        if (req.isAuthenticated()) {
            // does user own the Comment?
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    res.redirect("back");
                } else {
                 // To check if foundComment exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundComment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    // does the user own the Comment?
                    if (foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash('error',"You don't have authentication to do that");
                        res.redirect("back")
                    };
                };
            });
        } else {
            req.flash('error','The user is not Logged In');
            res.redirect("back");
        };
    };
// is loggedin middleware function

middlewareObj.isLoggedIn =(req, res, next)=> {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', ' Please Login First!');
    res.redirect('/login');
};


module.exports = middlewareObj;