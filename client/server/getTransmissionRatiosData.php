<?php
require __DIR__ . '/db.php'; // Kết nối CSDL

try {
    // Truy vấn dữ liệu từ bảng TiSoTruyenTrongHe
    $stmt = $pdo->query("SELECT LoaiTruyen, TisoTruyenMin, TisoTruyenMax FROM TiSoTruyenTrongHe");
    $ratios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $ratios]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
