var mongoose = require("mongoose"),
    ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = mongoose.Schema({
    login: String,
    password: String,
    name: String,
    surname: String,
    admin: Boolean,
    id: String,
    gamelike_id: [{ type: ObjectId, ref: "Game" }]
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
