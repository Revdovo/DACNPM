<?php
require __DIR__ . '/db.php'; // Kết nối CSDL

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT NhanHieuThep, NhietLuyen, KichThuocS_Min, KichThuocS_Max, DoRanMin, DoRanMax, GioiHanBenMin, GioiHanBenMax, GioiHanChay FROM CoTinhVatLieuBanhRang");
    $materials = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'materials' => $materials]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
