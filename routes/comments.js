var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//NEW - 
router.get("/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
      if (err){
        req.flash("error", err.message);
        console.log(err);
      } else {
        //render show template with that campground
        res.render("comments/new", {campground:foundCampground});          
      }
  });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, foundCampground) {
      if (err){
        req.flash("error", err.message);
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        //create new comment        
        Comment.create(
            req.body.comment,
            function (err, newComment) {
                if (err){
                    req.flash("error", err.message);
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    //add username and id to comments
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    //connect new comment to campground
                    foundCampground.comments.push(newComment);
                    foundCampground.save(function(err){
                        if (err){
                            req.flash("error", err.message);
                            console.log(err);
                        } else {
                            req.flash("success","Comment added!");
                            //redirect capground show page                        
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });

                }
        });
      }
  });
});

//EDIT
router.get("/:comment_id/edit", middleware.isUserCommentOwner, function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).exec(function(err, foundCampground) {
        if (err){
            req.flash("error", err.message);
            return console.log(err);
        } 
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                req.flash("error", err.message);
                return console.log(err);
            }
            //render show template with that campground
            res.render("comments/edit", {campground:foundCampground, comment: foundComment});             
        });
    });
});

// UPDATE ROUTE
router.put("/:comment_id",  middleware.isUserCommentOwner, function(req, res){
    var id = req.params.comment_id;
    // get data from form and add to array
    var comment = req.body.comment;
    Comment.findByIdAndUpdate(id, comment, {new:true}, function(err, updatedComment) {
        if (err){
            req.flash("error", err.message);
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("successs","Comment Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
}); 

//ROUTE DESTROY   
router.delete("/:comment_id", middleware.isUserCommentOwner, function(req, res){
    var id = req.params.comment_id;
    Comment.findByIdAndRemove(id, function(err) {
        if (err){
            req.flash("error", err.message);
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});  


module.exports = router;