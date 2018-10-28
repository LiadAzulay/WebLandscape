var express = require("express"),
    Landscape = require("../models/landscaps"),
    middlewareObj = require("../middleware"),
    router = express.Router();

///index
router.get("/", function(req, res) {
    Landscape.find({}, function(err, allLandscapes) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("landscape/landscapes", { landscapes: allLandscapes, currentUser: req.user });
        }
    });


});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newlandscape = { name: name, image: image, description: desc, author: author };
    // landscapes.push(newlandscape);
    Landscape.create(newlandscape, function(err, newlyCreated) {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect("/landscapes");
        }
    });
    //save to db
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("landscape/new");
});
///SHOW
router.get("/:id", function(req, res) {

    Landscape.findById(req.params.id).populate("comments").exec(function(err, foundLandscape) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("landscape/show", { landscape: foundLandscape });
        }
    });
});
///edit
router.get("/:id/edit", middlewareObj.checkLandscapeOwnership, function(req, res) {
    Landscape.findById(req.params.id, function(err, foundLandscape) {
        if (err) {
            console.log(err);
        }
        res.render("landscape/edit", { landscape: foundLandscape });
    });

});
router.put("/:id", middlewareObj.checkLandscapeOwnership, function(req, res) {

    Landscape.findByIdAndUpdate(req.params.id, req.body.landscape, function(err, updatedlandscape) {
        if (err) {
            res.redirect("/landscapes");
        }
        else {
            res.redirect("/landscapes/" + req.params.id);
        }
    });
});

////delete
router.delete("/:id", middlewareObj.checkLandscapeOwnership, function(req, res) {

    Landscape.findByIdAndRemove(req.params.id, function(err, updatedlandscape) {
        if (err) {
            res.redirect("/landscapes");
        }
        else {
            res.redirect("/landscapes");
        }
    });
});

module.exports = router;