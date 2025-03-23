<?php
require 'db.php';

header("Content-Type: application/json"); // Đảm bảo phản hồi JSON

if (!isset($_SESSION['user'])) {
    error_log("ERROR: Người dùng chưa đăng nhập!");
    echo json_encode(["status" => "error", "message" => "Bạn cần đăng nhập để tham gia workspace!"]);
    exit();
}

$curuser_id = $_SESSION['user']['id'];
$code = $_POST['code'] ?? '';

if (empty($code) || !preg_match('/^\d{6}$/', $code)) {
    error_log("ERROR: Mã không hợp lệ!");
    echo json_encode(["status" => "error", "message" => "Mã phòng phải gồm đúng 6 số!"]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT entry_id, user_id FROM workspace WHERE code = ?");
    $stmt->execute([$code]);
    $workspace = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$workspace) {
        error_log("ERROR: Mã không tồn tại!");
        echo json_encode(["status" => "error", "message" => "Mã không tồn tại!"]);
        exit();
    }

    $workspace_id = $workspace['entry_id'];
    $user_id = $workspace['user_id'];

    if ($curuser_id == $user_id) {
        echo json_encode([
            "status" => "success",
            "message" => "Bạn là chủ sở hữu của workspace này!",
            "code" => $code
        ]);
        exit();
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM workspace_guests WHERE workspace_id = ? AND user_id = ?");
    $stmt->execute([$workspace_id, $curuser_id]);
    $isGuest = $stmt->fetchColumn();

    if (!$isGuest) {
        $stmt = $pdo->prepare("INSERT INTO workspace_guests (workspace_id, user_id) VALUES (?, ?)");
        $stmt->execute([$workspace_id, $curuser_id]);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Mã hợp lệ! Chuyển hướng...",
        "code" => $code
    ]);
} catch (PDOException $e) {
    error_log("ERROR: Lỗi truy vấn CSDL - " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Lỗi truy vấn CSDL!"]);
}
?>
