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
            <aside class="col-3 sidebar d-flex flex-column">
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
                        <button id="manualCalculationBtn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#calculationModal">
                            Tính
                        </button>
                        <button id="autoCalculationBtn" class="btn btn-danger">
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
                    </div>
                </section>
            </aside>

            <!-- 3D Canvas -->
            <main class="col-6 canvas-container position-relative" id="canvas-container">
                <!-- Dropdown để chọn tab -->
                <div class="mb-3 w-50" id="tabSelectorContainer">
                    <label for="resultSelector" class="form-label">Chọn mục kết quả:</label>
                    <select id="resultSelector" class="form-select">
                        <option value="tab1">Chọn Động Cơ</option>
                        <option value="tab2">Thiết kế bộ truyền bánh răng côn</option>
                        <option value="tab3">Thiết kế bộ truyền bánh răng trụ</option>
                        <option value="tab4">Thiết kế bộ truyền xích</option>
                        <option value="tab5">Thiết kế trụ</option>
                    </select>

                    <!-- Nút Ẩn/Hiện cột kết quả -->
                    <button id="toggleResultBtn" class="btn btn-primary mt-2 w-100">Hiện kết quả</button>

                    <button id="boardModel" class="btn btn-primary mt-2 w-100" data-bs-toggle="modal" data-bs-target="#boardModal">
                        Bảng đặc tính
                    </button>
                    <button id="numberBoardModel" class="btn btn-primary mt-2 w-100" data-bs-toggle="modal" data-bs-target="#numberBoardModal">
                        Thông số
                    </button>
                </div>


                <aside class="col-3 result-container d-flex flex-column align-items-center d-none">
                    <h2>Kết quả</h2>

                    <!-- Nội dung các tab -->
                    <div class="tab-content w-100 overflow-auto" style="max-height: 75vh;">
                        <div id="tab1" class="d-none">
                            <h5>Chọn Động Cơ</h5>
                            <div></div>
                        </div>

                        <div id="tab2" class="d-none">
                            <h5>Thiết kế bộ truyền bánh răng côn</h5>
                            <div></div>
                        </div>

                        <div id="tab3" class="d-none">
                            <h5>Thiết kế bộ truyền bánh răng trụ</h5>
                            <div></div>
                        </div>

                        <div id="tab4" class="d-none">
                            <h5>Thiết kế bộ truyền xích</h5>
                            <div></div>
                        </div>

                        <div id="tab5" class="d-none">
                            <h5>Thiết kế trụ</h5>
                            <div></div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    </div>


    <?php include 'components/footer.php'; ?>
    <?php include 'components/cal_error.php'; ?>
    <?php include 'components/calculation.php'; ?>
    <?php include 'components/chatbox.php'; ?>
    <?php include 'components/board.php'; ?>
    <?php include 'components/numberBoard.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
