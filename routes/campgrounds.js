const express = require('express');
let router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
let middleware = require('../middleware'); // we don't need to call index.js as it is by dafult set directory

//INDEX- Show all campgrounds

router.get('/', (req, res) => {
    //we get all the campgrounds from the DB
    Campground.find({}, (err, allCamps) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('campgrounds/index', { campgrounds: allCamps });
        }
    })
})

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    // save the username and id inot a variable author and save it with the campground
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { name: req.body.name, price: req.body.price,image: req.body.image, description: req.body.description, author };

    // Creat a new campground and save it to DB
    Campground.create(newCampground, (err, newAdded) => {
        if (err) {
            console.log(err);
        } else {
            // redirect to the /campground
            res.redirect('/campgrounds');
        };
    });
});

//NEW- show form to new campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})

//SHOW -shows more info about campgrounds
router.get("/:id", (req, res) => {
    //find the campgrounds with id 
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {

            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            };
            // console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (!foundCamp) {
            return res.status(400).send("Item not found.")
        };
        res.render("campgrounds/edit", { camp: foundCamp });
    });
});


// Update from the edit route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    //find and update the correct campground 
    // redirect the page
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        };
    });
});


// DESTROY CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;