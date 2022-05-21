var User = require("../models/user.js"),
    mongoose = require("mongoose"),
    UsersController = {};
const Comment = require("../models/commets.js");

// проверка, не существует ли уже пользователь
User.find({}, function (err, result) {
    if (err !== null) {
        console.log("Что-то идет не так");
        console.log(err);
    } else if (result.length === 0) {
        console.log("Создание тестового пользователя...");
        var exampleUser = new User({"login":"guest", "password":"",
                                    "name":"Test_name", "surname":"Test",
                                    "admin":false});
        exampleUser.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Тестовый пользователь сохранен");
            }
        });
    }
});

// Создать нового пользователя
UsersController.create = function (req, res) {
    console.log("Попытка создания пользователя под логином " + req.body.login);
    let login = req.body.login,
        password = req.body.pass,
        name = req.body.name,
        surname = req.body.surname,
        admin = req.body.adm;
    User.find({"login" : login}, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (result.length !== 0) {
            console.log("я тутаы")
            res.status(200).json({message: "Данный логин уже используется, попробуйте другой"});
            //res.status(501).send("Error");
        } else {
            let newUser = new User({login, password,
                name, surname, admin
            });
            newUser.save(function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json({result, message: "success"});
                }
            });
        }
    });
};

UsersController.enter = function (req, res) {
    let login = req.body.login,
        password = req.body.password;
    console.log(`Попытка войти по данным пользователя \n
    логин ${login} \n пароль ${password}`);
    console.log(req.body);
    respondWithUser = function (query) {
        User.find(query, function (err, users) {
            if (err !== null) {
                res.json(500, err);
            } else {
                console.log(users);
                if (users.length === 0) {
                    console.log("Данного пользователя не существует");
                    res.status(200).json({message: "login_fail"});
                }
                else {
                    if (users[0].password != password) {
                        console.log("Данные введены не верно");
                        res.status(200).json({message: "password_fail"});
                    }
                    else {
                        console.log({users});
                        res.status(200).json({users, message: "success"});
                    }
                }
            }
        });
    };
    //typeof myVar !== 'undefined'
    if (login !== '') {
        console.log("Поиск пользователя: " + login);
        respondWithUser({"login": login});
    }
    else {
        console.log("Введите пожалуйста данные");
        res.status(200).json({message: "fail"});
    }
};

UsersController.index = function (req, res) {
    let login = req.params.login || null;
    console.log("Попытка найти пользователя по логину " + login);
    respondWithUser = function (query) {
        User.find(query, function (err, users) {
            if (err !== null) {
                res.json(500, err);
            } else {
                console.log({users});
                res.status(200).json({users, message: "Нашли"});
            }
        });
    };
    if (login !== null) {
        console.log("Поиск пользователя: " + login);
        respondWithUser({"login" : login});
    }
    else {
        console.log("Вывод всех пользователей");
        respondWithUser({});
    }
};

// Отобразить пользователя
UsersController.show = function (req, res) {
    console.log("вызвано действие: показать");
    res.send(200);
};

// Обновить существующего пользователя
UsersController.update = function (req, res) {
    console.log("Попытка найти пользователя по логину " + req.body.login);
    let login = req.params.login,
        newUserData = {$set : {
                password : req.body.password,
                name : req.body.name,
                surname : req.body.surname,
                admin : req.body.admin,
                gamelike_id: req.body.gamelike_id
            }
        };
    User.updateOne({"login" : login}, newUserData, function (err, user) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (user.n === 1 && user.nModified === 1 && user.ok === 1) {
                console.log("SUCCESSFUL");
                res.status(200).json(user);
            } else {
                res.status(404).json("NOT FOUND");
            }
        }
    });
};

// Удалить существующего пользователя
UsersController.destroy = function (req, res) {
    console.log("Попытка удалить пользователя по логину " + req.body.login);
    let login = req.body.login;
    User.deleteOne({"login" : login}, function (err, user) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (user.n === 1 && user.deletedCount === 1 && user.ok === 1) {
                console.log("DELETED FROM LIST");
                Comment.deleteMany({"login": login}, function (err, comment) {
                    if (err) {
                        console.log("Не удалось удалить комментарии пользователя " + login)
                    } else {
                        if (comment.n !== 0 && comment.deletedCount !== 0 && comment.ok !== 0) {
                            console.log("Комментарии были успешно удалены");
                            //res.status(200).json(comment);
                        } else {
                            console.log(`Данный пользователь не оставлял комментариев`);
                        }
                    }
                });
                res.status(200).json(user);
            } else {
                res.status(404).json({"status" : 404});
            }
        }
    });
};

module.exports = UsersController;