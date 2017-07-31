// All the middleware goes here
var Comment             = require("../models/comment"),
    Campground          = require("../models/campground");

var middlewareObj = {};


middlewareObj.isUserCampgroundOwner = 
    function(req, res, next){
        //is user logged in?
        if (!req.isAuthenticated()) {
            req.flash("warning","Please Login First!");
            return res.redirect("/login");    
        }
        //find the campground with provided ID
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err){
                req.flash("error",err.message);
                console.log(err);
                return res.redirect("back");
            } 
            //does the user own the campground
            if (!foundCampground.author.id.equals(req.user.id))
            {
                req.flash("error","You are not the campground owner!");
                return res.redirect("/login");
            }
            return next();
        });
    }

middlewareObj.isLoggedIn = 
    function(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        } 
        req.flash("warning","Please Login First!");
        res.redirect("/login");
    }

middlewareObj.isUserCommentOwner =
    function (req, res, next){
        //is user logged in?
        if (!req.isAuthenticated()) {
            req.flash("warning","Please Login First!");
            return res.redirect("/login");    
        }
        //find the comment with provided ID
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err){
                req.flash("error",err.message);
                return res.redirect("back");
            } 
            //does the user own the campground
            if (!foundComment.author.id.equals(req.user.id))
            {
                req.flash("error","You are not the comment owner!");
                return res.redirect("back");
            }
            return next();
        });
    }
    
module.exports = middlewareObj;