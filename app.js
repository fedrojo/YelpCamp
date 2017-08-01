var express             = require("express"),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    Comment             = require("./models/comment"),
    Campground          = require("./models/campground"),
    seedDB              = require("./seeds"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user"),
    flash               = require('connect-flash');;

// configure dotenv
require('dotenv').load();

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//require moment
app.locals.moment = require('moment');

// use flash
app.use(flash());


//Connect and will create if DB does not exist
// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
// mongoose.connect("mongodb://fedrojo:Malena09@ds129053.mlab.com:29053/yelp_camp_fedrojo", {useMongoClient: true});
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, {useMongoClient: true});



mongoose.Promise = global.Promise;

//SEED THE DB  -- seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "SECRET NUMBER 9",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.messageSuccess = req.flash("success");
    res.locals.messageWarning = req.flash("warning");
    res.locals.messageError = req.flash("error");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp server has started!");
})

