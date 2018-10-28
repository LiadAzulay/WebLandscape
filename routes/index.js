var express = require("express"),
    passport = require("passport"),
    user = require("../models/user"),
    router = express.Router();

router.get("/", function(req, res) {
    res.render("landing");
});

/////////////////////================================================//////////////////
/////////////////////==============auth ROUTE========================//////////////////
/////////////////////================================================//////////////////
router.get("/register", function(req, res) {
    res.render("register");
});
router.post("/register", function(req, res) {
    user.register(new user({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            req.flash("error", err.message);

            return res.render('register');
        }
        else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "successfully login");
                res.redirect("/landscapes");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/landscapes",
        failureRedirect: "/login"
    }),
    function(req, res) {

    });

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Thank you, hope to see you soon");
    res.redirect("/landscapes");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}
module.exports = router;
