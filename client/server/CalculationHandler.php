<?php
session_start();
require '../server/db.php'; 

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_SESSION['user'])) {
        echo json_encode(["success" => false, "message" => "Bạn chưa đăng nhập!"]);
        exit();
    }

    $user_id = $_SESSION['user']['id'];
    $num1 = $_POST['num1'] ?? null;
    $num2 = $_POST['num2'] ?? null;
    $num3 = $_POST['num3'] ?? null;

    // Kiểm tra số hợp lệ
    if ($num1 === null || $num2 === null || $num3 === null) {
        echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ số!"]);
        exit();
    }
    if ($num1 < 0 || $num2 < 0 || $num3 < 0) {
        echo json_encode(["success" => false, "message" => "Các số không được âm!"]);
        exit();
    }

    try {
        // Tạo mã code 6 chữ số ngẫu nhiên, đảm bảo không trùng
        do {
            $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM workspace WHERE code = ?");
            $stmt->execute([$code]);
            $exists = $stmt->fetchColumn();
        } while ($exists > 0);

        // Chèn vào bảng workspace với step mặc định là 0
        $stmt = $pdo->prepare("INSERT INTO workspace (user_id, num1, num2, num3, step, code) VALUES (?, ?, ?, ?, 0, ?)");
        $stmt->execute([$user_id, $num1, $num2, $num3, $code]);

        echo json_encode(["success" => true, "message" => "Workspace đã được tạo!", "code" => $code]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Lỗi cơ sở dữ liệu!"]);
    }
}
?>
