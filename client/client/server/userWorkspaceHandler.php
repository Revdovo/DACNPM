<?php
require_once __DIR__ . '/../server/db.php';
header("Content-Type: application/json");

function getUserWorkspaces($userId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM Workspace WHERE user_id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getGuestWorkspaces($userId) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT w.* 
        FROM Guest g
        JOIN Workspace w ON g.workspace_id = w.id
        WHERE g.user_id = ?
    ");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function deleteWorkspace($userId, $workspaceId) {
    global $pdo;

    if (!$pdo) {
        error_log("Lỗi: Kết nối CSDL không tồn tại.");
        return false;
    }

    try {
        $pdo->beginTransaction();

        // Kiểm tra xem workspace có tồn tại và thuộc về user không
        $stmt = $pdo->prepare("SELECT id FROM Workspace WHERE id = ? AND user_id = ?");
        $stmt->execute([$workspaceId, $userId]);
        $workspace = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$workspace) {
            error_log("Lỗi: Workspace không tồn tại hoặc không thuộc về người dùng.");
            $pdo->rollBack();
            return false;
        }

        $stmt = $pdo->prepare("DELETE FROM guest WHERE workspace_id = ?");
        $stmt->execute([$workspaceId]);

        $stmt = $pdo->prepare("DELETE FROM Workspace WHERE id = ? AND user_id = ?");
        $stmt->execute([$workspaceId, $userId]);

        $pdo->commit();
        return true;
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Lỗi khi xóa workspace: " . $e->getMessage());
        return false;
    }
}

function leaveWorkspace($userId, $workspaceId) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM Guest WHERE workspace_id = ? AND user_id = ?");
    return $stmt->execute([$workspaceId, $userId]);
}

function createWorkspace($userId) {
    global $pdo;

    $workspaceCode = str_pad(mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
    $status = "pending";

    try {
        $stmt = $pdo->prepare("
            INSERT INTO Workspace (user_id, code, status, num_of_steps, P, n, L) 
            VALUES (?, ?, ?, 0, NULL, NULL, NULL)
        ");
        $stmt->execute([$userId, $workspaceCode, $status]);

        return true;
    } catch (Exception $e) {
        return false;
    }
}
?>
