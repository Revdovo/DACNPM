<?php
session_start();
require '../server/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Bạn chưa đăng nhập!"]);
    exit();
}

$user_id = $_SESSION['user']['id'];
$code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

$stmt = $pdo->prepare("INSERT INTO workspace (user_id, num1, num2, num3, code) VALUES (?, 0, 0, 0, ?)");
if ($stmt->execute([$user_id, $code])) {
    echo json_encode(["success" => true, "code" => $code]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi tạo workspace!"]);
}
