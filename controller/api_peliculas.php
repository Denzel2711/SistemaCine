<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require_once("../config/conexion.php");
require_once("../models/pelicula.php");

$peliculas = new Pelicula();
$body = json_decode(file_get_contents("php://input"), true);

if (!isset($_GET["op"])) {
    http_response_code(400);
    echo json_encode(["error" => "Operación no especificada"]);
    exit;
}

if (!$body && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    echo json_encode(["error" => "Datos no proporcionados o formato JSON inválido"]);
    exit;
}

try {
    switch ($_GET["op"]) {
        case "Listar":
            echo json_encode($peliculas->obtener_peliculas());
            break;

        case "Insertar":
            if (!isset($body["Titulo"], $body["Genero"], $body["Duracion"])) {
                throw new Exception("Faltan datos para insertar la película");
            }
            $peliculas->insertar_pelicula($body["Titulo"], $body["Genero"], $body["Duracion"]);
            echo json_encode(["mensaje" => "Película agregada"]);
            break;

        case "Actualizar":
            if (!isset($body["Id"], $body["Titulo"], $body["Genero"], $body["Duracion"])) {
                throw new Exception("Faltan datos para actualizar la película");
            }
            $peliculas->actualizar_pelicula($body["Id"], $body["Titulo"], $body["Genero"], $body["Duracion"]);
            echo json_encode(["mensaje" => "Película actualizada"]);
            break;

        case "Eliminar":
            if (!isset($body["Id"])) {
                throw new Exception("Falta el ID para eliminar la película");
            }
            $peliculas->eliminar_pelicula($body["Id"]);
            echo json_encode(["mensaje" => "Película eliminada"]);
            break;

        default:
            throw new Exception("Operación no válida");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}
