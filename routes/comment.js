var express         = require("express");
var router          = express.Router({ mergeParams: true});
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
//var middleware      = require("../middleware");

//============================
//Comment route
//============================
//Comment new
router.get("/new",isLoggedIn, function(req, res){
    //find campground by Id
    Campground.findById(req.params.campgroundId, function(err,campground){
        if (err){
            console.log(err)
        } else {
            console.log('########################',req.params);
            res.render("comment/new", {campground:campground});
        }
    })
    
})
//Comment create
router.post("/", isLoggedIn, function(req, res){
    //lockup campground using ID
    Campground.findById(req.params.campgroundId, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campground");
        } else{
           Comment.create(req.body.comment, function(err, createdComment){
               console.log(req.body)
               if(err){
                   console.log(err)
               } else {
                //add username and id to comment
                createdComment.author.id = req.user._id;
                createdComment.author.username = req.user.username;
                createdComment.timeAdded = Date.now();
                //console.log("new comment username will be:" + req.user.username)
                //save to db
                createdComment.save();
                campground.comment.push(createdComment);
                campground.save();
                console.log("comment");
                req.flash('success', 'Successfully Created a Comment!');
                res.redirect("/campground/" + campground._id);
               }
           }) ;
        }
    });
});

//Comment edit route
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log("Error loading comment", err);
            res.redirect("back");
        } else {
            res.render("comment/edit", {campground_id: req.params.campgroundId, comment: foundComment});
        }
    });
});

//Comment update route
router.put("/:comment_id/", function(req, res){
    //find and update the correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, Updatedcomment){
       if(err){
           res.redirect("back");
       } else {
        req.flash("success","Successfully Updated Your comment!");
           res.redirect("/campground/" + req.params.campgroundId);
       }
   });
});
//Destroy comment route
router.delete("/:comment_id/", checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){
       if(err){
           res.redirect("back");
       } else {
        req.flash("success","Successfully Deleted Your comment!");
           res.redirect("/campground/" + req.params.campgroundId);
       }
   });
});


function isLoggedIn(req, res, next){ 
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()){
           Comment.findById(req.params.comment_id, function(err, foundComment){
              if(err){
                  res.redirect("back");
              }  else {
                  // does user own the comment?
               if(foundComment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   res.redirect("back");
               }
              }
           });
       } else {
           res.redirect("back");
       }
   }

module.exports = router;


