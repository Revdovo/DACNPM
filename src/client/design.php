<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My App | Design</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

    <!-- Three.js Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>

    <!-- Controllers -->
    <script src="controller/3dModelController.js" defer></script>
    <script src="controller/calculationController.js" defer></script>
</head>
<body>
    <?php include 'components/header.php'; ?>

    <!-- Main Layout -->
    <div class="container-fluid">
        <div class="row h-100">
            <!-- Sidebar -->
            <aside class="col-2 sidebar d-flex flex-column">
                <section>
                    <h3>Tính toán</h3>
                    <form id="calculationForm">
                        <input type="number" name="num1" placeholder="Nhập số P" required>
                        <input type="number" name="num2" placeholder="Nhập số n" required>
                        <input type="number" name="num3" placeholder="Nhập số L" required>
                        <button type="submit">Tính</button>
                    </form>
                </section>

                <section class="mt-3">
                    <h3>Công cụ</h3>
                    <div class="tools">
                        <button class="btn btn-outline-light" id="exportPdf">
                            <i class="bi bi-file-earmark-pdf"></i> Xuất PDF
                        </button>
                        <button class="btn btn-outline-light" id="viewHistory">
                            <i class="bi bi-clock-history"></i> Lịch sử
                        </button>
                    </div>
                </section>
            </aside>

            <!-- 3D Canvas -->
            <main class="col-8 canvas-container position-relative" id="canvas-container">
                
            </main>

            <!-- Result Section -->
            <aside class="col-2 result-column d-flex flex-column align-items-center">
                <h2>Kết quả</h2>
                <p>(Placeholder)
            </aside>
        </div>
    </div>

    <?php include 'components/footer.php'; ?>

    <?php include 'components/cal_error.php'; ?>

    <?php include 'components/chatbox.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
