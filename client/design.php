<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Workspace</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">

    <!-- Three.js Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> 

    <!-- Thêm thư viện jsPDF -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <!-- Controllers -->
    
    <script src="controller/designController.js" defer></script>
    <script src="controller/3dModelController.js" defer></script>

</head>
<body>
    <?php include 'components/header.php'; ?>

    <!-- Main Layout -->
    <div class="container-fluid">
        <div class="row h-100">
            <!-- Sidebar -->
            <aside class="col-2 sidebar d-flex flex-column">
                <section class="mb-3 text-center">
                    <h3 class="text-white">Mã Workspace</h3>
                    <div class="d-flex align-items-center justify-content-center">
                        <input type="text" id="workspaceCodeDisplay" class="form-control text-center fw-bold code-box" readonly>
                    </div>
                    <small id="workspaceStatus" class="text-warning mt-2 fw-bold d-block fs-5">Trạng thái: pending</small>
                </section>

                <section>
                    <h3>Tính toán</h3>
                    <form id="calculationForm">
                        <input type="number" name="num1" placeholder="Nhập số P" required step="any" min="0">
                        <input type="number" name="num2" placeholder="Nhập số n" required step="any" min="0">
                        <input type="number" name="num3" placeholder="Nhập số L" required step="any" min="0">
                        <button type="submit" id="updateButton">Cập nhật dữ liệu</button>
                    </form>
                    <div class="d-flex align-items-center gap-2">
                        <button id="manualCalculationBtn" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#calculationModal">
                            Tính
                        </button>
                        <button id="autoCalculationBtn" class="btn btn-danger btn-lg">
                            <i class="bi bi-gear"></i>
                        </button>
                    </div>
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
                        <button class="btn btn-outline-light" id="boardModel" data-bs-toggle="modal" data-bs-target="#boardModal">
                            <i class="bi"></i> Bảng đặc tính
                        </button>
                        <button class="btn btn-outline-light" id="view3DModel">
                            <i class="bi"></i> Mô hình 3D
                        </button>
                    </div>
                </section>
            </aside>

            <!-- Result Section -->
            <main class="col-10 result-container d-flex flex-column align-items-center">
            <h2>Kết quả</h2>
                <div id="calculationResult" class="d-flex w-100 justify-content-between">
                    <div class="col calculation-section"><h5>Chọn Động Cơ</h5></div>
                    <div class="col calculation-section"><h5>Thiết kế bộ truyền bánh răng</h5></div>
                    <div class="col calculation-section"><h5>Thiết kế bộ trục</h5></div>
                    <div class="col calculation-section"><h5>Thiết kế bộ ổ lăn</h5></div>
                    <div class="col calculation-section"><h5>Thiết kế bộ vỏ hộp giảm tốc và bôi trơn</h5></div>
                </div>
                <div id="calculationResult" class="d-flex w-100 justify-content-between">
                    <div class="result-col col"></div>
                    <div class="result-col col"></div>
                    <div class="result-col col"></div>
                    <div class="result-col col"></div>
                    <div class="result-col col"></div>
                </div>
            </main>

            <!-- 3D Canvas -->
            <!-- <main class="col-8 canvas-container position-relative" id="canvas-container">
            </main> -->
        </div>
    </div>

    <?php include 'components/footer.php'; ?>
    <?php include 'components/cal_error.php'; ?>
    <?php include 'components/calculation.php'; ?>
    <?php include 'components/chatbox.php'; ?>
    <?php include 'components/board.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
