<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Responde con 200 OK para las solicitudes OPTIONS
    exit;
}
require_once("../config/conexion.php");
require_once("../models/funcion.php");

$funcion = new Funcion();
$body = json_decode(file_get_contents("php://input"), true);

switch ($_GET["op"]) {
    case "Listar":
        $datos = $funcion->listar_funciones();
        echo json_encode($datos);
        break;

    case "Insertar":
        $datos = $funcion->insertar_funcion($body["PeliculaId"], $body["SalaId"], $body["Fecha"], $body["Hora"], $body["Precio"]);
        echo json_encode(["Correcto" => "Función agregada exitosamente"]);
        break;

    case "Actualizar":
        $datos = $funcion->actualizar_funcion($body["Id"], $body["PeliculaId"], $body["SalaId"], $body["Fecha"], $body["Hora"], $body["Precio"]);
        echo json_encode(["Correcto" => "Función actualizada exitosamente"]);
        break;

    case "Eliminar":
        $datos = $funcion->eliminar_funcion($body["Id"]);
        echo json_encode(["Correcto" => "Función eliminada exitosamente"]);
        break;
}
?>
