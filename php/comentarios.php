<?php
require 'db.php';

// Habilitar la notificación de errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Función para insertar un comentario
function insertarComentario($nombre, $apellidos, $email, $comentarios, $ip) {
    $conn = conectarBaseDatos("comments");
    $stmt = $conn->prepare("CALL InsertarComentario(?, ?, ?, ?, ?)");
    
    if ($stmt === false) {
        $error_msg = "Error al preparar el procedimiento almacenado para insertar: " . $conn->error;
        error_log($error_msg); // Log de error
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $error_msg));
        exit;
    }
    
    $stmt->bind_param("sssss", $nombre, $apellidos, $email, $comentarios, $ip);
    
    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Nuevo registro creado exitosamente"));
    } else {
        $error_msg = "Error al ejecutar el procedimiento almacenado para insertar: " . $stmt->error;
        error_log($error_msg); // Log de error
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => $error_msg));
    }
    
    $stmt->close();
    $conn->close();
}

// Función para obtener comentarios
function obtenerComentarios() {
    $conn = conectarBaseDatos("comments");
    $stmt = $conn->prepare("CALL ObtenerComentarios()");
    
    if ($stmt === false) {
        $error_msg = "Error al preparar el procedimiento almacenado para obtener comentarios: " . $conn->error;
        error_log($error_msg); // Log de error
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        exit;
    }
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $comentarios = $result->fetch_all(MYSQLI_ASSOC);
        return $comentarios; // Devolver los comentarios como un arreglo asociativo
    } else {
        $error_msg = "Error al ejecutar el procedimiento almacenado para obtener comentarios: " . $stmt->error;
        error_log($error_msg); // Log de error
        http_response_code(500);
        echo json_encode(array("message" => $error_msg));
        exit;
    }
    
    $stmt->close();
    $conn->close();
}

// Manejo de solicitudes
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtener la IP del cliente
    $ip = $_SERVER['REMOTE_ADDR'];

    // Obtener los datos del formulario y asegurarse de que no estén vacíos
    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $email = $_POST['email'] ?? '';
    $comentarios = $_POST['comentarios'] ?? '';

    // Log para mostrar los datos recibidos del formulario en el servidor
    error_log("Datos recibidos del formulario:");
    error_log("Nombre: " . $nombre);
    error_log("Apellidos: " . $apellidos);
    error_log("Email: " . $email);
    error_log("Comentarios: " . $comentarios);

    // Validar los datos del formulario
    if (empty($nombre) || empty($apellidos) || empty($email) || empty($comentarios)) {
        http_response_code(400); // Bad Request
        echo json_encode(array("message" => "Todos los campos son obligatorios"));
        exit;
    }

    // Llamar a la función para insertar el comentario
    insertarComentario($nombre, $apellidos, $email, $comentarios, $ip);

} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Obtener comentarios si es una solicitud GET
    header("Content-Type: application/json");
    echo json_encode(obtenerComentarios());

} else {
    // Manejar métodos no permitidos
    http_response_code(405); // Método no permitido
    echo json_encode(array("message" => "Método no permitido"));
}
?>
