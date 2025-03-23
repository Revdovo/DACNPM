<?php
require_once 'db.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['code']) || !isset($data['num1']) || !isset($data['num2']) || !isset($data['num3'])) {
        http_response_code(400);
        throw new Exception("Thiếu thông tin cần thiết", 400);
    }

    $code = $data['code'];
    $num1 = (int) $data['num1'];
    $num2 = (int) $data['num2'];
    $num3 = (int) $data['num3'];

    $stmt = $pdo->prepare("UPDATE workspace SET num1 = ?, num2 = ?, num3 = ? WHERE code = ?");
    $stmt->execute([$num1, $num2, $num3, $code]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
    } else {
        http_response_code(400);
        throw new Exception("Không có thay đổi hoặc mã workspace không hợp lệ", 400);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
