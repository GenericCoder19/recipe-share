const middleware = {};
const recipe = require("../models/recipe");

middleware.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/users');
}

middleware.checkOwnership = function checkOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    recipe.findById(req.params.id, function (err, foundRecipe) {
      if (err || !foundRecipe) {
        req.flash("error", "No recipe found");
        res.redirect("back");
      } else {
        if(foundRecipe.createdByID == req.user._id) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
  }
}

module.exports = middleware;
