let Game = require("../models/game.js"),
    User = require("../models/user.js"),
    Comment = require("../models/commets.js"),
    mongoose = require("mongoose"),
    CommentController = {};

// Создать новую страницу для игры
CommentController.create = function (req, res) {
    console.log(`Пользователь ${req.body.login} пишет ${req.body.comment_text} 
            под постом об игре ${req.body.game.name}`);
    let login = req.body.login,
        text_comment = req.body.comment_text,
        id_game = req.body.game._id;

    let newComment = new Comment({login, text_comment, "game": id_game});

    newComment.save(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    });

};

CommentController.index = function (req, res) {
    let game = req.params.game_id;
    respondWithGames = function (query) {
        Comment.find(query, function (err, comment) {
            if (err !== null) {
                res.json(500, err);
            } else {
                console.log({comment});
                res.status(200).json(comment);
            }
        });
    };
    if (game !== null) {
        console.log("Поиск комментариев игры: " + game);
        respondWithGames({"game" : game});
    }
    else {
        console.log("Данной игры нет, комментариев тоже");
    }
};

CommentController.update = function (req, res) {
    let oldCommentData = {
            login : req.body.login,
            text_comment: req.body.old_text_comment,
            game : req.body.game._id,
        },
        newCommentData = {$set : {
            login : req.body.login,
            text_comment: req.body.text_comment,
            game : req.body.game._id,
        }
        };
    Comment.updateOne(oldCommentData, newCommentData, function (err, comment) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (comment.n === 1 && comment.nModified === 1 && comment.ok === 1) {
                console.log("SUCCESSFUL");
                res.status(200).json(comment);
            } else {
                res.status(404).json("NOT FOUND");
            }
        }
    });
};

CommentController.update_login = function (req, res) {
    let old_login = req.body.old_login,
        new_login = {$set : {login : req.body.new_login}};
    Comment.updateMany({"login": old_login}, new_login, function (err, comment) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (comment.n !== 0 && comment.nModified !== 0 && comment.ok !== 0) {
                console.log("SUCCESSFUL");
                res.status(200).json(comment);
            } else {
                res.status(404).json("NOT FOUND");
            }
        }
    });
};

CommentController.destroy = function (req, res) {
    let CommentData = {
        login : req.body.login,
        text_comment: req.body.text_comment,
        game : req.body.game._id,
    }
    console.log(CommentData);
    Comment.deleteOne(CommentData, function (err, comment) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (comment.n === 1 && comment.deletedCount === 1 && comment.ok === 1) {
                console.log("DELETED FROM LIST");
                res.status(200).json(comment);
            } else {
                res.status(404).json({"status" : 404});
            }
        }
    });
};

module.exports = CommentController;