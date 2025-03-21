<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My App | Quản lý Workspace</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

    <!-- Controllers -->
    <script src="controller/workspaceController.js" defer></script>
</head>
<body>
    <?php include 'components/header.php'; ?>

    <div class="container mt-4">
        <h2 class="text-center">Quản lý Workspace</h2>

        <div class="container">
            <h2>Quản lý Workspace</h2>
            
            <div class="mb-3">
                <button class="btn btn-primary" onclick="createWorkspace()">Tạo Workspace Mới</button>
                <input type="text" id="joinCode" class="form-control d-inline-block w-auto" placeholder="Nhập mã để tham gia">
                <button class="btn btn-success" onclick="joinWorkspace()">Tham gia</button>
            </div>
        </div>

        <hr>

        <!-- Danh sách workspace -->
        <h4>Danh sách Workspace</h4>
        <ul id="workspaceList" class="list-group">
            <li class="list-group-item">Đang tải...</li>
        </ul>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
