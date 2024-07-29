<?php

function conectarBaseDatos($db_name) {
    require 'config.php';

    // Determinar las credenciales según el nombre de la base de datos
    if ($db_name === 'comments') {
        $servername = $comment_db_config['servername'];
        $username = $comment_db_config['username'];
        $password = $comment_db_config['password'];
    } elseif ($db_name === 'dblibreria') {
        $servername = $libreria_db_config['servername'];
        $username = $libreria_db_config['username'];
        $password = $libreria_db_config['password'];
    } else {
        error_log("Nombre de base de datos no reconocido: " . $db_name);
        die("Nombre de base de datos no reconocido.");
    }

    // Crear la conexión
    $conn = new mysqli($servername, $username, $password, $db_name);

    // Verificar la conexión
    if ($conn->connect_error) {
        error_log("Conexión fallida a $db_name: " . $conn->connect_error);
        die("Conexión fallida: " . $conn->connect_error);
    } else {
        error_log("Conexión exitosa a la base de datos $db_name.");
    }

    return $conn;
}

?>
