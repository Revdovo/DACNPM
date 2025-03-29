<?php
require __DIR__ . '/db.php'; // Kết nối CSDL

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, kieu_dong_co, cong_suat_kw, cong_suat_ma_luc, van_toc_50Hz, van_toc_60Hz, hieu_suat, cos_phi, I_K_I_dn, T_K_T_dn, khoi_luong FROM DongCoDienK");
    $engines = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'engines' => $engines]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
