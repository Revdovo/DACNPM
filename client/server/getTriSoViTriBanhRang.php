<?php
require __DIR__ . '/db.php'; // Kết nối CSDL

header('Content-Type: application/json');

try {
    // Truy vấn lấy dữ liệu cho vị trí "Không đối xứng"
    $stmt = $pdo->prepare("SELECT TriSo, DoRanMatRang_Min1, DoRanMatRang_Max1 FROM TriSoViTriBanhRang WHERE ViTri = 'Không đối xứng'");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
