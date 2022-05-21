let Game = require("../models/game.js"),
    User = require("../models/user.js"),
    Comment = require("../models/commets.js")
    mongoose = require("mongoose"),
    GamesController = {};

// проверка, существования тестовой игры
Game.find({}, function (err, res) {
    if (err !== null) {
        console.log("Что-то идет не так");
        console.log(err);
    } else if (res.length === 0) {
        console.log("Создание первой игры...");
        let login = "guest",
            exampleGame = new Game({"name":"Tetris",
                "textgame":"Одна из первых игр созданых ещё во времена СССР",
                "comments": [],
                "image_path": "./gamepicture/scale_1200.png"});
        User.find({ "login": login }, function (err, users) {
            if (err) {
                console.log(`Произошла непредвиденная ошибка при поиске клиента ${err}`)
            } else {
                if (users.length === 0) {
                    console.log("Тестовый пользователь не найден, ошибка")
                    exampleGame.author = null;
                } else {
                    exampleGame.author = users[0]._id;
                }
                exampleGame.save(function (err, gameres) {
                    if (err !== null) {
                        console.log(`Игра не создалась, ошибочка при сохранении ${err}`);
                    } else {
                        console.log("Игра создана");
                    }
                });
            }
        });
    }
});

// Создать новую страницу для игры
GamesController.create = function (req, res) {
    console.log("Создается новая страница игры " + req.body.name);
    let name = req.body.name,
        textgame = req.body.textgame,
        image_path = req.body.image_path,
        author_login = req.body.login;

    Game.find({"name" : name}, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (result.length !== 0) {
            res.status(501).send("Страница с такой игрой уже существует");
        } else {
            let newGame = new Game({"name":name, "textgame":textgame,
                // "comments": [],
                "image_path": image_path});
            User.find({ "login": author_login }, function (err, users) {
                if (err) {
                    res.send(500);
                } else {
                    if (users.length === 0) {
                        console.log("Пользователь не найден, ошибка, пожалуйста перелогиньтесь")
                        newGame.author = null;
                    } else {
                        newGame.author = users[0]._id;
                        newGame.save(function (err, gameres) {
                            if (err) {
                                console.log(err);
                                res.status(500).json(err);
                            } else {
                                res.status(200).json(gameres);
                            }
                        });
                    }
                }
            });
        }
    });
};

GamesController.index = function (req, res) {
    let name = req.params.game_name || null;
    console.log(name);
    respondWithGames = function (query) {
        Game.find(query, function (err, games) {
            if (err !== null) {
                res.json(500, err);
            } else {
                console.log({games});
                res.status(200).json(games);
            }
        });
    };
    if (name !== null) {
        console.log("Поиск игры: " + name);
        respondWithGames({"name" : name});
    }
    else {
        console.log("Вывод всех статей об играх");
        respondWithGames({});
    }
};

GamesController.update = function (req, res) {
    let name = req.params.name,
        newGameData = {$set : {
                textgame : req.body.textgame,
                image_path: req.body.image_path,
                comments : req.body.comments,
            }
        };
    Game.updateOne({"name" : name}, newGameData, function (err, games) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (games.n === 1 && games.nModified === 1 && games.ok === 1) {
                console.log("SUCCESSFUL");
                res.status(200).json(games);
            } else {
                res.status(404).json("NOT FOUND");
            }
        }
    });
};

// Удаление страницы игры
GamesController.destroy = function (req, res) {
    let name = req.body.name,
        game_id = req.body.game_id;
    console.log("Попытка удалить страницу игры " + name);
    Game.deleteOne({"name" : name}, function (err, games) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (games.n === 1 && games.deletedCount === 1 && games.ok === 1) {
                console.log("DELETED FROM LIST");
                Comment.deleteMany({"game": game_id}, function (err, comment) {
                    if (err) {
                        console.log("Не удалось удалить комментарии к игре " + game_id)
                    } else {
                        if (comment.n !== 0 && comment.deletedCount !== 0 && comment.ok !== 0) {
                            console.log("Комментарии были успешно удалены");
                            //res.status(200).json(comment);
                        } else {
                            console.log(`Игра ${name} была удалена, а вот комментарии к ней не были найдены id = ${game_id}`);
                        }
                    }
                });
                res.status(200).json(games);
            } else {
                res.status(404).json({"status" : 404});
            }
        }
    });
};
module.exports = GamesController;