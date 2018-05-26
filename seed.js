var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var data = [
        {
            name: "martins", 
            image: "http://albertawow.com/campgrounds/Wapiti/Wapiti%20Campground%20Jasper%205993.JPG",
            description: "osapa london number 13."
        },
        {
            name: "YINKA", 
            image: "http://albertawow.com/campgrounds/Wapiti/Wapiti%20Campground%20Jasper%205993.JPG",
            description: "osapa london number 13."
        },
        {
            name: "LUCKY", 
            image: "http://albertawow.com/campgrounds/Wapiti/Wapiti%20Campground%20Jasper%205993.JPG",
            description: "osapa london number 13."
            }
]

function seedDB(){
    //REMOVE ALL CAMPGROUND
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        }
        console.log("removed campground!");
            //ADD A FEW CAMPGROUND
                data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                     if(err){
                            console.log(err);
                            }else {
                             console.log("added a campground");
                            //create comment
                             Comment.create(
                            {
                                 text:"This campgrounds is beatiful",
                                 author:"lucky"
                             }, function(err, comment){
                                if(err){
                                    
                                    console.log("err");
                                } else {
                                    console.log('+++++++++++++',comment)
                                    campground.comment.push(comment);
                                    campground.save();
                                    console.log("created new comment");
                                }
                             });

                             }
                         });
                     });
    });

}
module.exports = seedDB;
