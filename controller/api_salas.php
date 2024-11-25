<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
require_once("../config/conexion.php");
require_once("../models/sala.php");

$sala = new Sala();
$body = json_decode(file_get_contents("php://input"), true);

switch ($_GET["op"]) {
    case "Listar":
        $datos = $sala->listar_salas();
        echo json_encode($datos);
        break;

    case "Insertar":
        $datos = $sala->insertar_sala($body["Nombre"], $body["Capacidad"], $body["Tipo"]);
        echo json_encode(["Correcto" => "Sala agregada exitosamente"]);
        break;

    case "Actualizar":
        $datos = $sala->actualizar_sala($body["Id"], $body["Nombre"], $body["Capacidad"], $body["Tipo"]);
        echo json_encode(["Correcto" => "Sala actualizada exitosamente"]);
        break;

    case "Eliminar":
        $datos = $sala->eliminar_sala($body["Id"]);
        echo json_encode(["Correcto" => "Sala eliminada exitosamente"]);
        break;
}
?>
