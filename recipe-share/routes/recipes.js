var express = require('express');
var router = express.Router();
var Recipe = require("../models/recipe");
var moment = require('moment');
const splitLine = require("split-lines");



/* GET home page. */
router.get('/', function (req, res, next) {
    Recipe.find({}, function (err, allRecipes) {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/index', { recipes: allRecipes, moment: moment });
        }
    })
});

router.post('/', function (req, res, next) {

    let { name, image, description } = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
    }
    let ingredients = splitLine(req.body.ingredients);
    let instructions = splitLine(req.body.instructions)

    let newRecipe = { name, image, description, ingredients, instructions };
    Recipe.create(newRecipe, function (err, newlyMade) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/recipes');
        }
    })
});

router.get('/new', function (req, res, next) {
    res.render('recipes/new');
});

router.get("/:id", function (req, res, next) {
    Recipe.findById(req.params.id,function (err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/view', { recipe: foundRecipe });
        }
    })
});

module.exports = router;