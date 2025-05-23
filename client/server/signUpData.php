<?php
require 'db.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(["success" => false, "message" => "Email đã được sử dụng."]);
            exit();
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$name, $email, $hashedPassword, 'user'])) {
            $_SESSION["user"] = ["name" => $name, "email" => $email, "role" => "user"];
            echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi đăng ký!"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi CSDL: " . $e->getMessage()]);
    }
}
?>
