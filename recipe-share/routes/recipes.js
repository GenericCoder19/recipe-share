var express = require('express');
var router = express.Router();
var Recipe = require("../models/recipe");

/* GET home page. */
router.get('/', function (req, res, next) {
    Recipe.find({}, function (err, allRecipes) {
        if (err) {
            console.log(err);
        } else {
            console.log(allRecipes[0]);
            res.render('recipes/index', { recipes: allRecipes });
        }
    })
});

router.post('/', function (req, res, next) {
    let { name, image, description, ingredients, instructions} = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    }

    let newRecipe = { name, image, description, ingredients, instructions};
    Recipe.create(newRecipe,function(err, newlyMade){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/recipes');
        }
    })
});

router.get('/new', function (req, res, next) {
    res.render('recipes/new');
});

module.exports = router;