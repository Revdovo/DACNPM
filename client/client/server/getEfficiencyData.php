<?php
require __DIR__ . '/db.php'; // Kết nối CSDL

try {
    $stmt = $pdo->query("SELECT TenGoi, HieuSuatDuoccheMin, HieuSuatDuoccheMax, HieuSuatDeHoMin, HieuSuatDeHoMax FROM TriSoHieuSuat");
    $efficiencies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $efficiencies]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
