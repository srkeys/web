var mongoose = require("mongoose"),
    ObjectId = mongoose.Schema.Types.ObjectId;

var GameSchema = mongoose.Schema({
    name: String,
    textgame: String,
    author: { type: ObjectId, ref: "User" },
    image_path: String
});

var Game = mongoose.model("Game", GameSchema);
module.exports = Game;