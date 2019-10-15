const express = require('express');
let router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
let Notification = require("../models/notification");
let middleware = require('../middleware'); // we don't need to call index.js as it is by dafult set directory
//geocoder:
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//INDEX- Show all campgrounds

router.get('/', async (req, res) => {
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

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    let price =req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var newCampground = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, (err, newlyCreated)=>{
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              res.redirect("/campgrounds");
          }
      });
    });
  });


//NEW- show form to new campgrounds
router.get("/new", middleware.isLoggedIn,async (req, res) => {
    res.render("campgrounds/new");
})

//SHOW -shows more info about campgrounds
router.get("/:id", async(req, res) => {
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
router.get("/:id/edit", middleware.checkCampgroundOwnership, async(req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (!foundCamp) {
            return res.status(400).send("Item not found.")
        };
        res.render("campgrounds/edit", { camp: foundCamp });
    });
});

// UPDATE CAMPGROUND ROUTE FROM THE EDIT ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location,  (err, data) => {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect(`/campgrounds/${req.params.id}`);
          }
      });
    });
  });


// DESTROY CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;