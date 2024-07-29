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

function obtenerLibros($page, $perPage)
{
    $conn = conectarBaseDatos("dblibreria");

    // Calcular el desplazamiento
    $offset = ($page - 1) * $perPage;

    // Preparar y ejecutar el procedimiento almacenado para obtener los libros
    $stmt = $conn->prepare("CALL ObtenerLibros()");
    if ($stmt === false) {
        $error_msg = "Error al preparar el procedimiento almacenado para obtener libros: " . $conn->error;
        error_log($error_msg);
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        $conn->close();
        exit();
    }

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $libros = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
    } else {
        $error_msg = "Error al ejecutar el procedimiento almacenado para obtener libros: " . $stmt->error;
        error_log($error_msg);
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        $stmt->close();
        $conn->close();
        exit();
    }

    // Obtener el total de libros para paginación
    $stmtTotal = $conn->prepare("
        SELECT COUNT(DISTINCT C.id_titulo) AS total
        FROM dblibreria.titulo_autor AS A
        INNER JOIN dblibreria.autores AS B ON A.id_autor = B.id_autor
        INNER JOIN dblibreria.titulos AS C ON C.id_titulo = A.id_titulo
    ");
    if ($stmtTotal === false) {
        $error_msg = "Error al preparar la consulta para contar los libros: " . $conn->error;
        error_log($error_msg);
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        $conn->close();
        exit();
    }

    if ($stmtTotal->execute()) {
        $resultTotal = $stmtTotal->get_result();
        $totalLibros = $resultTotal->fetch_assoc()['total'];
        $stmtTotal->close();
    } else {
        $error_msg = "Error al ejecutar la consulta para contar los libros: " . $stmtTotal->error;
        error_log($error_msg);
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        $stmtTotal->close();
        $conn->close();
        exit();
    }

    $conn->close();

    // Calcular el número total de páginas
    $totalPages = ceil($totalLibros / $perPage);

    return array("libros" => $libros, "totalPages" => $totalPages);
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    header("Content-Type: application/json");

    // Obtener parámetros de paginación
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $perPage = isset($_GET['perPage']) ? intval($_GET['perPage']) : 10; // Número de libros por página (por defecto 10)

    echo json_encode(obtenerLibros($page, $perPage));
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Método no permitido"));
}
?>
