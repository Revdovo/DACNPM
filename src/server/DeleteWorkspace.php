<?php
session_start();
require '../server/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Bạn chưa đăng nhập!"]);
    exit();
}

$user_id = $_SESSION['user']['id'];
$entry_id = $_POST['entry_id'] ?? '';

$stmt = $pdo->prepare("DELETE FROM workspace WHERE entry_id = ? AND user_id = ?");
if ($stmt->execute([$entry_id, $user_id])) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi xóa workspace!"]);
}
