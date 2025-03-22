<?php
session_start();
require '../server/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Bạn chưa đăng nhập!"]);
    exit();
}

$user_id = $_SESSION['user']['id'];
$code = $_POST['code'] ?? '';

$stmt = $pdo->prepare("SELECT entry_id FROM workspace WHERE code = ?");
$stmt->execute([$code]);
$workspace = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$workspace) {
    echo json_encode(["success" => false, "message" => "Mã workspace không hợp lệ!"]);
    exit();
}

// Thêm vào bảng workspace_guests
$stmt = $pdo->prepare("INSERT IGNORE INTO workspace_guests (workspace_id, user_id) VALUES (?, ?)");
if ($stmt->execute([$workspace['entry_id'], $user_id])) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi tham gia workspace!"]);
}
