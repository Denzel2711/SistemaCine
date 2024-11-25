<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require_once("../config/conexion.php");
require_once("../models/pelicula.php");

$peliculas = new Pelicula();
$body = json_decode(file_get_contents("php://input"), true);

switch ($_GET["op"]) {
    case "Listar":
        echo json_encode($peliculas->obtener_peliculas());
        break;

    case "Insertar":
        $peliculas->insertar_pelicula($body["Titulo"], $body["Genero"], $body["Duracion"]);
        echo json_encode(["mensaje" => "Película agregada"]);
        break;

    case "Actualizar":
        $peliculas->actualizar_pelicula($body["Id"], $body["Titulo"], $body["Genero"], $body["Duracion"]);
        echo json_encode(["mensaje" => "Película actualizada"]);
        break;

    case "Eliminar":
        $peliculas->eliminar_pelicula($body["Id"]);
        echo json_encode(["mensaje" => "Película eliminada"]);
        break;
}
