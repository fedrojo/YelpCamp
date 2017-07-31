var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all capgrounds
router.get("/", function(req,res){
    if(req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                req.flash("error", err.message);
                console.log(err);
            } else {
                res.status(200).json(allCampgrounds);
            }
        });
    } else {
        Campground.find({}, function(err, allCampgrounds) {
            if (err) {
                req.flash("error", err.message);
                console.log(err);
            } else {
                if(req.xhr) {
                    res.json(allCampgrounds);
                } else {
                    res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
                }    
            }
        });
    }
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new") 
});

//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to array
    var newCampground = req.body.campground;
    //add username and id to campground
    newCampground.author = {
            id : req.user._id,
            username : req.user.username
    };
    
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);         
            return res.redirect("back");
        }
        newCampground.lat = data.results[0].geometry.location.lat;
        newCampground.lng = data.results[0].geometry.location.lng;
        newCampground.location = data.results[0].formatted_address;

        Campground.create(newCampground, function(err, campground){
            if (err){
                req.flash("error", err.message);
                console.log(err);
            } else {
                //redirect to campgrounds page
                req.flash("success", "Campground Successfuly Created!");
                res.redirect("/campgrounds");
            }
        });
    });
});

//SHOW - show details on campground
router.get("/:id", function(req,res){
   //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
      if (err){
        req.flash("error", err.message);
        console.log(err);
      } else {
        //render show template with that campground
        res.render("campgrounds/show", {campground:foundCampground});          
      }
  })
});

// EDIT
router.get("/:id/edit", middleware.isUserCampgroundOwner, function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err){
            req.flash("error", err.message);
            return console.log(err);
        } 
        //render show template with that campground
        res.render("campgrounds/edit", {campground:foundCampground});          
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.isUserCampgroundOwner,  function(req, res){
    var id = req.params.id;
    // get data from form and add to array
    var campground = req.body.campground;
    
    geocoder.geocode(req.body.location, function (err, data) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);         
            return res.redirect("back");
        }
        campground.lat = data.results[0].geometry.location.lat;
        campground.lng = data.results[0].geometry.location.lng;
        campground.location = data.results[0].formatted_address;
        
        Campground.findByIdAndUpdate(id, campground, {new:true}, function(err, updatedCampground) {
            if (err){
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            } else {
                req.flash("success","Campground Updated!");
                res.redirect("/campgrounds/" + id);
            }
        });
    });
}); 

//ROUTE DESTROY   
router.delete("/:id", middleware.isUserCampgroundOwner, function(req, res){
    var id = req.params.id;
    Campground.findByIdAndRemove(id, function(err) {
        if (err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash("success","Campground Deleted!");
            res.redirect("/campgrounds");
        }
    })
});   


module.exports = router;