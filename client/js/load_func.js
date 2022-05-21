let load_func_auth = function () {
    $.removeCookie("page", {path: "/"});
    let current_page = decodeURI(document.location.pathname)
    //console.log(current_page)
    let login = $.cookie("login"),
        admin = $.cookie("admin");
    //console.log("Login " + login);
    //console.log("Admin " + admin);
    if (login !== undefined) {
        if (admin === undefined) {
            $.getJSON(`/${login}/user.json`, function (result) {
                $.cookie("admin", result.users[0].admin);
                location.reload();
            })
        }
        $("#reg").attr("href", "").text("Выход").click(function () {
            let options = {path : "/"};
            $.removeCookie("login", {path : "/"});
            $.removeCookie("admin", {path : "/"});
            location.reload();
        });
        $("#user_name").text(login);
    }
    else {
        if (admin !== undefined) {
            $.removeCookie("admin", {path : "/"});
        }
        login = "guest";
        admin = "false";
        $("#reg").attr("href", "/registration.html").text("Регистрация|Вход").click(function (){
            $.cookie("page", current_page, {path : "/"});
        });
        $("#user_name").remove();
    }
    //console.log(login + " " + admin);
    admin = (admin !== "false");
    return {login, admin}
}
    // load_func_game = function (games) {
    //
    // }
