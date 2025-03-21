<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My App | Index</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <?php include 'components/header.php'; ?>

    <!-- Main Content -->
    <main class="container mt-5 text-center">
        <h1 class="text-primary">Chào mừng đến với Công cụ Tính Toán Hộp Giảm Tốc</h1>
        <p class="lead">
            Đây là nền tảng hỗ trợ tính toán các thông số quan trọng cho thiết kế hộp giảm tốc.  
            Mô hình 3D được tích hợp giúp trực quan hóa phần bánh răng thiết kế.
        </p>
        
        <!-- Tính năng chính -->
        <section class="row">
            <div class="col-md-4">
                <div class="card shadow p-3">
                    <h3><i class="bi bi-calculator"></i> Tính toán thông số</h3>
                    <p>Hỗ trợ các công thức tính toán giúp bạn xác định các thông số quan trọng của hộp giảm tốc.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow p-3">
                    <h3><i class="bi bi-box"></i> Mô hình 3D trực quan</h3>
                    <p>Hiển thị hình ảnh mô phỏng các bộ phận của hộp giảm tốc để hỗ trợ thiết kế.</p>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow p-3">
                    <h3><i class="bi bi-collection"></i> Thư viện Catalog</h3>
                    <p>Kho dữ liệu chứa thông tin và thông số kỹ thuật của các bộ phận thường dùng.</p>
                </div>
            </div>
        </section>        

        <!-- Nút điều hướng -->
        <div class="mt-4">
            <a href="design.php" class="btn btn-primary btn-lg">Bắt đầu Thiết kế</a>
            <a href="catalog.php" class="btn btn-outline-secondary btn-lg">Khám phá Catalog</a>
        </div>
    </main>

    <?php include 'components/footer.php'; ?>

    <!-- Bootstrap Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
