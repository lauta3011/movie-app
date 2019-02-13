window.fn = {};
var datos = {};

window.fn.open = function() {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
            .then(menu.close.bind(menu));
};

document.addEventListener("init", function(evt) {
    var _pagDestino = evt.target.id;

    switch (_pagDestino) {
        case "pagBusqueda":
            $("#btnBuscar").click(buscarPeliculas);
            break;
        case "pagResultado":

            var _p = datos.peliculas.results;

            for (i = 0; i < _p.length; i++) {
                $("#dResultado").append("<div><div class='card peli' data-peli='" + _p[i].id + "'><h2 class='card__title'>" + _p[i].title + "</h2><div class='card__content'><img src='https://image.tmdb.org/t/p/w500" + _p[i].poster_path + "'>" + "</div></div></div>");
            }
            $(".peli").click(cargarDetallesPelicula);
            break;
        case "pagPelicula":
            var _det = datos.detallePeli;
            var _estrellas = Math.round(_det.vote_average / 2);
            
            $("#detalles-peli>h2").html(_det.title);
            $("#detalles-peli>img").attr("src","https://image.tmdb.org/t/p/w500" + _det.poster_path);

            for (i = 1; i <= 5; i++) {
                            $("#estrellas").append("<i class='icono ion-star' style='color:"+(i<=_estrellas?"#c90":"#999")+"'></i>");
            }
            $("#gen").html(_det.genres[0].name);
            $("#detalles-peli>p").html(_det.overview);
    }
});

function buscarPeliculas() {
    var _peli = $("#txtPelicula").val();

    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        type: "GET",
        datatype: "json",
        data: {
            query: _peli,
            api_key: "0d13cbb13af31d53ca30550020660e13"
        },
        beforeSend: mostrarLoader,
        success: mostrarPelicula,
        error: mostrarError
    });
}
;

function mostrarLoader() {
    $(".progress-bar").show();
}

function mostrarError(_error) {
    console.log(_error);
}

function mostrarPelicula(_peli) {
    $(".progress-bar").hide();

    datos.peliculas = _peli;
    $("#content")[0].load("resultado.html");
}

function cargarDetallesPelicula() {
    var _peli = $(this).attr("data-peli");

    $.ajax({
        url: "https://api.themoviedb.org/3/movie/" + _peli,
        type: "GET",
        datatype: "json",
        data: {
            api_key: "0d13cbb13af31d53ca30550020660e13"
        },
        success: detallePelicula,
        error: mostrarError
    });
}

function detallePelicula(_peli) {
    datos.detallePeli = _peli;
    $("#content")[0].load("pelicula.html");
}