<?php
session_start();
require '../server/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    echo json_encode(["success" => false, "message" => "Bạn chưa đăng nhập!"]);
    exit();
}

$user_id = $_SESSION['user']['id'];

// Truy vấn danh sách workspace do người dùng sở hữu
$query = "
    SELECT w.entry_id, w.code, 1 AS owned
    FROM workspace w
    WHERE w.user_id = ?
    UNION
    SELECT w.entry_id, w.code, 0 AS owned
    FROM workspace w
    JOIN workspace_guests wg ON w.entry_id = wg.workspace_id
    WHERE wg.user_id = ?
";
$stmt = $pdo->prepare($query);
$stmt->execute([$user_id, $user_id]);

$workspaces = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "workspaces" => $workspaces]);
