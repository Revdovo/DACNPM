<?php
require_once __DIR__ . '/../server/db.php';
header("Content-Type: application/json");

function getUserWorkspaces($userId) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM workspace WHERE user_id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getGuestWorkspaces($userId) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT w.* 
        FROM workspace_guests wg
        JOIN workspace w ON wg.workspace_id = w.entry_id
        WHERE wg.user_id = ?
    ");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function deleteWorkspace($userId, $workspaceId) {
    global $pdo;

    $pdo->beginTransaction();
    
    try {
        $stmt = $pdo->prepare("DELETE FROM workspace_guests WHERE workspace_id = ?");
        $stmt->execute([$workspaceId]);

        $stmt = $pdo->prepare("DELETE FROM workspace WHERE entry_id = ? AND user_id = ?");
        $stmt->execute([$workspaceId, $userId]);

        $pdo->commit();
        return true;
    } catch (Exception $e) {
        $pdo->rollBack();
        return false;
    }
}


function leaveWorkspace($userId, $workspaceId) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM workspace_guests WHERE workspace_id = ? AND user_id = ?");
    return $stmt->execute([$workspaceId, $userId]);
}
