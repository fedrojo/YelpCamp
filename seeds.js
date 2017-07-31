//SEED File

var mongoose    =   require("mongoose");
var Campground  =   require("./models/campground");
var Comment     =   require("./models/comment");

var data = [
    {
        name: "Salmon Creek", 
        image: "https://www.visitnc.com/resimg.php/imgcrop/2/52908/image/800/448/KerrCamping.jpg", 
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        
    },
    {   
        name: "Yosemite", 
        image: "http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg", 
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        
    },
    {   name: "Zion", 
        image: "http://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/06/main/fall-camping-best-campgrounds-organ-pipe-cactus-national-monument-twin-peaks-1115.jpg?itok=11Jc3bMf", 
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        
    }
];

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("removed campgrounds");
            
            //add a few campgrounds
    
            // data.forEach(function(seed){
            //     Campground.create(seed, function(err, campground){
            //         if (err){
            //             console.log(err);
            //         } else {
            //             console.log("Added campground from seed");
            //             //create a comment
            //             Comment.create(
            //                 {
            //                     text: "This place is great but no internet",
            //                     author: "Pablo",
                                
            //                 }, function (err, comment) {
            //                     if (err){
            //                         console.log(err);
            //                     } else {
            //                         campground.comments.push(comment);
            //                         campground.save();
            //                         console.log("Comment added to campground");
            //                     }
            //                 });
            //         }
            //     });
            // });
            
        }
    })
    
}

module.exports =  seedDB;