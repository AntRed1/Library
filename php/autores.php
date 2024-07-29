<?php
require 'db.php';

// Habilitar la notificación de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Añadir encabezados CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

function obtenerAutores()
{
    $conn = conectarBaseDatos("dblibreria");

    // Preparar el procedimiento almacenado
    $stmt = $conn->prepare("CALL ObtenerAutores()");
    if ($stmt === false) {
        $error_msg = "Error al preparar el procedimiento almacenado para obtener autores: " . $conn->error;
        error_log($error_msg);
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        $conn->close();
        exit();
    }

    // Ejecutar el procedimiento almacenado
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $autores = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        $conn->close();
        
        return $autores;
    } else {
        $error_msg = "Error al ejecutar el procedimiento almacenado para obtener autores: " . $stmt->error;
        error_log($error_msg);
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        $stmt->close();
        $conn->close();
        exit();
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    header("Content-Type: application/json");
    echo json_encode(obtenerAutores());
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Método no permitido"));
}
?>