<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Workspace | My App</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="d-flex flex-column min-vh-100">
    <?php include 'components/header.php'; ?>

    <main class="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
        <h1 class="text-primary fw-bold">Tham gia vào Workspace</h1>

        <div class="bg-light p-4 rounded shadow-sm mt-4" style="width: 350px;">
            <input type="text" id="workspaceCode" class="form-control mb-3 text-center" placeholder="Nhập mã phòng" maxlength="6">
            <button id="joinButton" class="btn btn-primary w-100">Enter</button>
        </div>
    </main>

    <div class="text-center mt-auto pb-3">
        <p>Hoặc vào các Workspace của riêng bạn <a href="user_workspaces.php" class="text-primary">tại đây</a></p>
    </div>

    <?php include 'components/footer.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- JavaScript kiểm tra mã phòng -->
    <script src="controller/workspaceController.js"></script>
</body>
</html>
