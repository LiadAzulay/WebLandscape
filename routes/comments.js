var express = require("express"),
    Landscape = require("../models/landscaps"),
    Comment = require("../models/comment"),
    middlewareObj = require("../middleware"),

    router = express.Router({ mergeParams: true });

/////////////////////================================================//////////////////
/////////////////////==========COMMENTS ROUTE========================//////////////////
/////////////////////================================================//////////////////
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {

    Landscape.findById(req.params.id, function(err, foundLandscape) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("comment/new", { landscape: foundLandscape });
        }
    });
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
    //look for landscape

    Landscape.findById(req.params.id, function(err, foundLandscape) {
        if (err) {
            console.log(err)
            req.flash("error", "something went wrong");
            res.redirect("/landscapes");
        }
        else {
            //create new comment
            //connect new comment to landscapre
            ///rediredt to show
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundLandscape.comments.push(comment);
                    foundLandscape.save();
                    req.flash("success", "comment added successfully");

                    res.redirect('/landscapes/' + foundLandscape._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res) {

    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comment/edit", { landscape_id: req.params.id, comment: foundComment });


        }
    });
});
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomment) {
        if (err) {
            res.redirect("/landscapes");
        }
        else {
            res.redirect("/landscapes/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res) {

    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/landscapes");
            req.flash("success", "comment delete successfully");
        }
        else {
            req.flash("error", "Unable to delete comment");
            res.redirect("/landscapes");
        }
    });
});


module.exports = router;