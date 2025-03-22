<?php
$host = "sql12.freesqldatabase.com";
$dbname = "sql12768969";
$username = "sql12768969";
$password = "JSwlDlPmqu";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Lỗi kết nối CSDL: " . $e->getMessage()]));
}
?>
