let main = function (login, admin, game) {

    let comments = [],
        edit_text = "",
        change_index = "";
    //console.log(game);
    $("#game_name").text(game.name);
    $("#game_text").text(game.textgame);
    $("#game_picture").attr("src" , game.image_path).attr("alt", game.name)

    $("#user_label").text(`Пользователь:       ${login}`);

    let replaceString = function(s, n) {
        return s.substring(0, n) + " " + s.substring(n + 1);
    },

        back_edit_comment = function (index) {
            $("#user_text_comment").val("");
            let $comment = $(`#${index} > .comment_p`)
            edit_text = "";
            $comment.css("color", "black")
            $(".forum .comments li").children("button").prop("disabled", false);
            $("#comment_but").text("Отправить")
            change_index = "";
            $(`#abort_${index}`).remove();
        },

        edit_comment = function (index) {
            let $comment = $(`#${index} > .comment_p`),
                // > .comment_p
                comment_text = $($comment[1]).text();
            $("#user_text_comment").val(comment_text);
            edit_text = comment_text
            $comment.css("color", "aquamarine")
            $(".forum .comments li").children("button").prop("disabled", true);

            let $but_abort = $("<button>").attr("class", `label_but`)
                .attr("id", `abort_${index}`).text("Отменить");
            $($but_abort).on("click", function () {
                $("#empty_comment").text("");
                back_edit_comment(index);
                return false;
            })
            $(`#${index}`).append($but_abort);
            change_index = index;

            $("#comment_but").text("Принять")
        },

        delete_comment = function(index) {
            let $comment = $(`#${index} > .comment_p`),
                comment_text = $($comment[0]).text(),
                destroy_comment = {
                    login: comment_text.substring(0, (comment_text.length-1)),
                    text_comment: $($comment[1]).text(),
                    game: game
                }
            console.log(destroy_comment);
            $.post(`/comment_delete`, destroy_comment, function (result) {
                console.log(result);
                $(`#${index}`).remove();
            });
        },

        func_add_but_delete = function () {
            let $butDel = $("<button>").addClass("delete label_but").text("Удалить");
            // .attr("id", `but_del_${index}`)

            $($butDel).on("click", function () {
                $("#empty_comment").text("");
                console.log(`Вызвана функция удаления комментария
                            ${this.parentNode.id}`);
                delete_comment(this.parentNode.id)
                return false;
            })
            return $butDel;
        },

        func_add_but_edit = function () {
            let $butEd = $("<button>").addClass("update label_but").text("Изменить");

            $($butEd).on("click", function () {
                $("#empty_comment").text("");
                console.log(`Вызвана функция изменения комментария
                            ${this.parentNode.id}`);
                edit_comment(this.parentNode.id)
                return false;
            });
            return $butEd
        },

        func_add_comment = function (comment, index) {
            let $comment_login = $("<li>").attr("id", `comment_${index}`),
                $login = $("<p>").text(`${comment.login}:`).addClass("comment_p comment_login"),
                $text = $("<p>").text(`${comment.text_comment}`).addClass("comment_p comment_text");

            $comment_login.append($login).append($text)
            if (login !== "guest") {
                if ((login === comment.login)){
                    $comment_login.append(func_add_but_edit()).append(func_add_but_delete());
                } else if ((login === comment.login) || admin) {
                    $comment_login.append(func_add_but_delete());
                }
            }
            return $comment_login;
        },

        comment_func = function () {
        let user_text = $("#user_text_comment").val();
        // console.log(edit_text);
        console.log(user_text);
        if (user_text !== "") {
            for (let i = 0; i < user_text.length; i+=60) {
                let index = user_text.indexOf(" ", i);
                if ( ( ( index === -1) || (index > (i + 59) )) && ((i + 60) < user_text.length )) {
                    user_text = replaceString(user_text, i+59);
                }
            }
            if (edit_text !== "") {
                if (edit_text !== user_text) {
                    console.log("Происходит смена коментария");
                    let edit_comment = {login: login,
                        old_text_comment: edit_text,
                        text_comment: user_text,
                        game: game}
                    if (change_index !== "") {
                        $.post(`/comment_edit`, edit_comment, function (result) {
                            //console.log(result);
                            $(`#${change_index} > .comment_text`).text(edit_comment.text_comment);
                            back_edit_comment(change_index);
                        });
                    }
                    else {
                        console.log("Возникла ошибка, не найден индекс комментария");
                    }
                }
                else {
                    $("#empty_comment").text("Вы не изменили комментарий");
                }
            }
            else {
                let newComment = {login: login,
                    comment_text: user_text,
                    game: game}

                $.post(`/comment_create`, newComment, function (result) {
                    let $comments = $("<ul>"),
                        index = $("main .forum .comments ul").children().length;
                    $comments.append(func_add_comment(result, index));
                    $("main .forum .comments").append($comments);
                    console.log(result);
                });
            }
        }
        else {
            $("#empty_comment").text("Нельзя осталять пустой комментарий");
        }
    }

    $.getJSON(`/${game._id}/comment.json`, function (comments) {
        //console.log(comments);
        let $comments = $("<ul>"),
            index = 1;
        comments.forEach(function (comment) {
            $comments.append(func_add_comment(comment, index));
            index++;
        });
        $("main .forum .comments").append($comments);
    })


    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });

    $("#comment_but").on("click", function () {
        $("#empty_comment").text("");
        comment_func();
        return false;
    });

}

let get_name = function () {
    let name = decodeURI(document.location.pathname);
    name = name.replace("/games/","")
        .replace("/game.html","");
    return name;
}

$("document").ready(function () {
    let load_data = load_func_auth(),
        name = get_name();
    $.getJSON(`/${name}/games.json`, function (game) {
        // load_func_game(game);
        main(load_data.login, load_data.admin, game[0]);
    })
});