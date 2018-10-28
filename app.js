var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    user = require("./models/user"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Landscape = require("./models/landscaps"),
    seedDB = require("./seeds"),
    flash = require("connect-flash"),

    methodOverride = require("method-override"),


    Comment = require("./models/comment");

var landscapeRoutes = require("./routes/landscapes"),
    authRoutes = require("./routes/index"),
    commentsRoutes = require("./routes/comments");

// mongoose.connect("mongodb://localhost/landscapes");
mongoose.connect("mongodb://Llandscapes:Llandscapes1@ds245512.mlab.com:45512/llandscapes");

//
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();



app.use(require("express-session")({
    secret: "it's can be anything you want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.set("view engine", "ejs");

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use("/landscapes", landscapeRoutes);
app.use("/landscapes/:id/comments", commentsRoutes);
app.use(authRoutes);
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("landscape server started");
});