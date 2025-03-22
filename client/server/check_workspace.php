<?php
include 'db.php'; // Kết nối CSDL

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $code = $_POST['code'];

    if (preg_match('/^\d{6}$/', $code)) { // Kiểm tra mã có đúng 6 số không
        $stmt = $conn->prepare("SELECT * FROM workspaces WHERE code = ?");
        $stmt->bind_param("s", $code);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Tham gia thành công!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Mã không tồn tại!"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Mã phải là 6 số!"]);
    }
}
?>
