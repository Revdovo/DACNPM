<?php
session_start();
header("Content-Type: application/json"); // Đảm bảo trả về JSON

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? $_POST['action'] ?? '';

    switch ($action) {
        case 'signin':
            if ($method !== 'POST') throw new Exception("Method not allowed", 405);
            require __DIR__ . '/../server/SignInData.php';
            break;

        case 'signup':
            if ($method !== 'POST') throw new Exception("Method not allowed", 405);
            require __DIR__ . '/../server/SignUpData.php';
            break;

        case 'signout':
            if ($method !== 'POST') throw new Exception("Method not allowed", 405);
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Đăng xuất thành công']);
            exit;

        case 'check_workspace':
            require __DIR__ . '/../server/CheckWorkspaceData.php';
            break;

        case 'getWorkspace':
            require __DIR__ . '/../server/designDataHandler.php';
            echo json_encode(getWorkspaceData($_GET['code'] ?? ''));
            exit;

        case 'updateWorkspace':
            $data = json_decode(file_get_contents("php://input"), true);
            if (!$data || !isset($data['code'], $data['num1'], $data['num2'], $data['num3'])) {
                throw new Exception("Thiếu thông tin cần thiết", 400);
            }

            require __DIR__ . '/../server/designDataHandler.php';
            echo json_encode(updateWorkspaceData($data['code'], $data['num1'], $data['num2'], $data['num3']));
            exit;

        case 'get_user_workspaces':
            require __DIR__ . '/../server/userWorkspaceHandler.php';

            if (!isset($_SESSION['user']['id'])) {
                echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
                exit;
            }

            $workspaces = getUserWorkspaces($_SESSION['user']['id']);

            echo json_encode([
                'success' => true,
                'data' => $workspaces
            ]);
            exit;


        case 'get_guest_workspaces':
            require __DIR__ . '/../server/userWorkspaceHandler.php';
            
            if (!isset($_SESSION['user']['id'])) {
                echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
                exit;
            }

            $guestWorkspaces = getGuestWorkspaces($_SESSION['user']['id']);

            echo json_encode([
                'success' => true,
                 'data' => $guestWorkspaces
            ]);
            exit;

        case 'delete_workspace':
            require __DIR__ . '/../server/userWorkspaceHandler.php';
            
            if (!isset($_SESSION['user']['id'])) {
                echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
                exit;
            }

            $input = json_decode(file_get_contents("php://input"), true);
            $workspaceId = $input['workspace_id'] ?? null;
            
            if (!$workspaceId) {
                echo json_encode(['success' => false, 'message' => 'Thiếu workspace ID']);
                exit;
            }

            $result = deleteWorkspace($_SESSION['user']['id'], $workspaceId);
            echo json_encode(['success' => $result]);
            exit;

        case 'leave_workspace':
            require __DIR__ . '/../server/userWorkspaceHandler.php';
            
            if (!isset($_SESSION['user']['id'])) {
                echo json_encode(['success' => false, 'message' => 'Chưa đăng nhập']);
                exit;
            }

            $input = json_decode(file_get_contents("php://input"), true);
            $workspaceId = $input['workspace_id'] ?? null;
            
            if (!$workspaceId) {
                echo json_encode(['success' => false, 'message' => 'Thiếu workspace ID']);
                exit;
            }

            $result = leaveWorkspace($_SESSION['user']['id'], $workspaceId);
            echo json_encode(['success' => $result]);
            exit;

        default:
            throw new Exception("Invalid request", 400);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
