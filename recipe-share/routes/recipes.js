var express = require('express');
var router = express.Router();
var Recipe = require("../models/recipe");
var moment = require('moment');
const splitLine = require("split-lines");
var middleware = require("../middleware");


/* GET home page. */
router.get('/', function (req, res, next) {
    Recipe.find({}, function (err, allRecipes) {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/index', { recipes: allRecipes, moment: moment, currentUser: req.user });
        }
    })
});

router.post('/', function (req, res, next) {
    let { name, image, description, createdBy, createdByID } = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        createdBy: req.user.local.username,
        createdByID: req.user._id,
    }
    let ingredients = splitLine(req.body.ingredients);
    let instructions = splitLine(req.body.instructions)

    let newRecipe = { name, image, description, createdBy, createdByID, ingredients, instructions };
    Recipe.create(newRecipe, function (err, newlyMade) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/recipes');
        }
    })
});

router.get('/new', middleware.isLoggedIn, function (req, res, next) {
    res.render('recipes/new');
});

router.get("/:id", function (req, res, next) {
    Recipe.findById(req.params.id, function (err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/view', { recipe: foundRecipe, currentUser: req.user });
        }
    })
});

router.get("/:id/edit",middleware.checkOwnership, function (req, res, next) {
    Recipe.findById(req.params.id, function (err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/edit', { recipe: foundRecipe, currentUser: req.user });
        }
    })
});

router.put("/:id",middleware.checkOwnership,function (req,res,next) {
    let { name, image, description, createdBy, createdByID } = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        createdBy: req.user.local.username,
        createdByID: req.user._id,
    }
    let ingredients = splitLine(req.body.ingredients);
    let instructions = splitLine(req.body.instructions)

    let newUpdates = { name, image, description, createdBy, createdByID, ingredients, instructions };
    Recipe.findByIdAndUpdate(req.params.id,{$set: newUpdates}, function (err, updated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/recipes');
        }
    })
})

router.delete("/:id",middleware.checkOwnership,function(req,res,next){
    Recipe.findByIdAndRemove(req.params.id,function (err) {
        if (err) {
            res.redirect("/recipes");
        }else {
            res.redirect("/recipes");
        }
    })
})

module.exports = router;