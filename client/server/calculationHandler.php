<?php
include 'db.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'getEfficiency') {
    $result = $conn->query("SELECT * FROM TriSoHieuSuat");
    $efficiencyList = [];

    while ($row = $result->fetch_assoc()) {
        $efficiencyList[] = ['name' => $row['Loai'], 'value' => $row['HieuSuat']];
    }

    echo json_encode(["success" => true, "efficiencyList" => $efficiencyList]);
}

elseif ($action === 'getTransmissionRatios') {
    $result = $conn->query("SELECT * FROM TiSoTruyenTrongHe WHERE LoaiTruyen IN ('Truyền động Xích', 'Truyền động bánh răng trụ hộp giảm tốc 2 cấp')");
    $transmissionList = [];

    while ($row = $result->fetch_assoc()) {
        $transmissionList[] = [
            "type" => $row['LoaiTruyen'],
            "min" => $row['TisoTruyenMin'],
            "max" => $row['TisoTruyenMax']
        ];
    }

    echo json_encode(["success" => true, "transmissionList" => $transmissionList]);
}

elseif ($action === 'getWorkspaceData') {
    $code = $_GET['code'] ?? '';
    $result = $conn->query("SELECT * FROM Workspaces WHERE code = '$code'");
    
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "workspace" => $row]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy workspace"]);
    }
}

elseif ($action === 'getMotors') {
    $data = json_decode(file_get_contents("php://input"), true);
    $P = $data['requiredPower'];
    $n = $data['requiredSpeed'];

    $result = $conn->query("SELECT * FROM DongCoDienK WHERE cong_suat_kw > $P AND van_toc_50Hz > $n");

    $motors = [];
    while ($row = $result->fetch_assoc()) {
        $motors[] = $row;
    }

    echo json_encode(["success" => true, "motors" => $motors]);
}

$conn->close();
?>
