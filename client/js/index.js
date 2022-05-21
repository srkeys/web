let main = function (adm, games) {
    console.log(adm);
    console.log(games);

    let $content = $("<ul>");
    games.forEach(function (game) {
        let $li = $("<li>"),
            name = game.name,
            $game_name = $(`<a id = "#game_${name}" href = "/games/${game.name}/game.html">`).text(name);
            $content.append($li).append($game_name);
        $("main .games").append($content);
    });

    // let help_val = function (word) {
    //         return (word !== "" && word.trim() !== "");
    //     },
    //     film_showing = function (film) {
    //         let $film = $("<div>").addClass("film_main"),
    //             $img = $("<img>").addClass("film_img")
    //                 .attr("src", film.poster)
    //                 .attr("alt", film.name)
    //                 .attr("href", "/film.html?filmID=" + film._id),
    //             $img_div = $("<div>").addClass("film_img_div")
    //                 .append($img),
    //             $film_name = $("<a>").addClass("film_name")
    //                 .text(film.name)
    //                 .attr("href", "/film.html?filmID=" + film._id),
    //             $film_rating = $("<a>").addClass("film_age")
    //                 .text(film.age + "+"),
    //             $desc = $("<div>").addClass("description")
    //                 .append($film_name)
    //                 .append($film_rating);
    //         $film.append($img_div)
    //             .append($desc);
    //         return $film;
    //     },
    //     btn_func = function () {
    //         let filmer = $("#search_index").val();
    //         if (help_val(filmer)) {
    //             if (filmer === "pipisun") $(".content").text("PIPISUN");
    //             if (filmer === "oh, shit, i'm sorry") window.location.replace("https://pornhub.com");
    //             let $content = $("<div>").addClass("films");
    //             $.getJSON("films.json", function (films) {
    //                 films.forEach(function (film) {
    //                     if (film.name.toLowerCase().includes(filmer.toLowerCase())) {
    //                         $content.append(film_showing(film));
    //                     }
    //                 });
    //                 $(".content").html("").text(filmer).append($content);
    //             });
    //         }
    //     };
    //
    // $("#search_but_index").on("click", function () {
    //     btn_func();
    //     return false;
    // });
    //
    // $("#search_index").on("keypress", function (event) {
    //     if (event.keyCode === 13){
    //         btn_func();
    //         return false;
    //     }
    // });
    //
    // $("document").ready(function () {
    //     let $content = $("<div>").addClass("films");
    //     $.getJSON("films.json", function (films) {
    //         films.forEach(function (film) {
    //             $content.append(film_showing(film));
    //         });
    //         $(".content").append($content);
    //     });
    // });
};

$("document").ready(function () {
    let load_user = load_func_auth(decodeURI(document.location.href))
    $.getJSON(`/games.json`, function (result) {
        main(load_user.admin, result);
    })
});