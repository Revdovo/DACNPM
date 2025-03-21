<?php
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    require 'SignInData.php';
} elseif ($action === 'register') {
    require 'SignUpData.php';
} else {
    echo json_encode(["success" => false, "message" => "Invalid action!"]);
}
?>
