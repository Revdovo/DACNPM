<?php
require_once 'db.php';
header('Content-Type: application/json');

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';

        if ($action === 'getWorkspace') {
            if (empty($_GET['code'])) {
                http_response_code(400);
                throw new Exception("Thiếu mã workspace");
            }

            $code = $_GET['code'];

            // Lấy dữ liệu workspace
            $stmt = $pdo->prepare("SELECT * FROM workspace WHERE code = ? LIMIT 1");
            $stmt->bindParam(1, $code, PDO::PARAM_STR);
            $stmt->execute();
            $workspace = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$workspace) {
                http_response_code(404);
                throw new Exception("Workspace không tồn tại");
            }

            echo json_encode(["success" => true, "workspace" => $workspace]);
            exit;
        } else {
            http_response_code(400);
            throw new Exception("Yêu cầu không hợp lệ");
        }
    }

    elseif ($method === 'POST') {
        // Nhận dữ liệu từ client
        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['code']) || !isset($data['num1']) || !isset($data['num2']) || !isset($data['num3'])) {
            http_response_code(400);
            throw new Exception("Thiếu thông tin cần thiết");
        }

        $code = $data['code'];
        $num1 = (int) $data['num1'];
        $num2 = (int) $data['num2'];
        $num3 = (int) $data['num3'];

        // Kiểm tra xem workspace có tồn tại không
        $stmt = $pdo->prepare("SELECT * FROM workspace WHERE code = ? LIMIT 1");
        $stmt->bindParam(1, $code, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            throw new Exception("Workspace không tồn tại");
        }

        // Cập nhật dữ liệu
        $stmt = $pdo->prepare("UPDATE workspace SET num1 = ?, num2 = ?, num3 = ? WHERE code = ?");
        $stmt->bindParam(1, $num1, PDO::PARAM_INT);
        $stmt->bindParam(2, $num2, PDO::PARAM_INT);
        $stmt->bindParam(3, $num3, PDO::PARAM_INT);
        $stmt->bindParam(4, $code, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
        } else {
            http_response_code(400);
            throw new Exception("Không có thay đổi hoặc mã workspace không hợp lệ");
        }
        exit;
    }

    else {
        http_response_code(405);
        throw new Exception("Phương thức không hợp lệ");
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
