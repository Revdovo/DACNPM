<?php
require 'db.php';

header("Content-Type: application/json");

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
    $stmt = $pdo->prepare("SELECT id, user_id FROM Workspace WHERE code = ?");
    $stmt->execute([$code]);
    $workspace = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$workspace) {
        error_log("ERROR: Mã không tồn tại!");
        echo json_encode(["status" => "error", "message" => "Mã không tồn tại!"]);
        exit();
    }

    $workspace_id = $workspace['id'];
    $owner_id = $workspace['user_id'];

    if ($curuser_id == $owner_id) {
        echo json_encode([
            "status" => "success",
            "message" => "Bạn là chủ sở hữu của workspace này!",
            "code" => $code
        ]);
        exit();
    }

    // Kiểm tra nếu người dùng đã tham gia workspace trước đó
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM guest WHERE workspace_id = ? AND user_id = ?");
    $stmt->execute([$workspace_id, $curuser_id]);
    $isGuest = $stmt->fetchColumn();

    // Nếu chưa tham gia, thêm vào danh sách khách
    if (!$isGuest) {
        $stmt = $pdo->prepare("INSERT INTO guest (workspace_id, user_id) VALUES (?, ?)");
        $stmt->execute([$workspace_id, $curuser_id]);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Mã hợp lệ! Chuyển hướng...",
        "code" => $code
    ]);
} catch (PDOException $e) {
    error_log("ERROR: Lỗi truy vấn CSDL - " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Lỗi truy vấn CSDL: " . $e->getMessage()]);
}

?>
