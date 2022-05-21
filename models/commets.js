let mongoose = require("mongoose"),
    ObjectId = mongoose.Schema.Types.ObjectId;

let CommentSchema = mongoose.Schema({
    login: String,
    text_comment: String,
    game: { type: ObjectId, ref: "Game" }
});

let Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;