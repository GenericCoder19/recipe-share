const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    ingredients: [String],
    instructions: [String]
});

module.exports = mongoose.model("recipe", recipeSchema);