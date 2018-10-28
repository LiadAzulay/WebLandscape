var middlewareObj = {};
var Landscape = require("../models/landscaps"),
    Comment = require("../models/comment");


middlewareObj.checkLandscapeOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Landscape.findById(req.params.id, function(err, foundLandscape) {
            if (err) {
                req.flash("error", "landscape not found");
                res.redirect("back");
            }
            else {
                if (foundLandscape.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "please login first");
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
                req.flash("error", "Unable to add comment");

            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                    req.flash("error", "You don't have permission to do that");

                }
            }
        });
    }
    else {
        req.flash("error", "Please login");
        res.redirect("back");
    }
}
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "please login first");
        res.redirect("/login");
    }
}
module.exports = middlewareObj