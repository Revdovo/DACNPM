<?php
session_start();
require 'db.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập email và mật khẩu."]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user'] = ["id" => $user['id'], "name" => $user['name']];
            echo json_encode(["success" => true, "message" => "Đăng nhập thành công!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Sai email hoặc mật khẩu."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi kết nối CSDL!"]);
    }
}
?>
