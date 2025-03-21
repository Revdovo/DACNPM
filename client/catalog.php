<?php
$categories = [
    "dongco" => "Động cơ",
    "banhRang" => "Bánh răng",
    "oTruc" => "Ổ trục"
];

$selectedCategory = isset($_GET['category']) ? $_GET['category'] : 'dongco';
$searchQuery = isset($_GET['search']) ? $_GET['search'] : '';
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My App | Catalog</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
</head>
<body>
    <?php include 'components/header.php'; ?>

    <!-- Main Layout -->
    <div class="container-fluid mt-3">
        <div class="row">
            <aside class="col-3 bg-light p-3">
                <h4>Danh mục</h4>
                <ul class="list-group">
                    <?php foreach ($categories as $key => $value): ?>
                        <li class="list-group-item <?= ($selectedCategory == $key) ? 'active' : '' ?>">
                            <a href="catalog.php?category=<?= $key ?>" class="text-decoration-none text-dark d-block"><?= $value ?></a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </aside>

            <main class="col-9">
                <h3 class="mb-3">Thông số kỹ thuật</h3>

                <form method="GET" class="mb-3">
                    <input type="hidden" name="category" value="<?= htmlspecialchars($selectedCategory) ?>">
                    <div class="input-group">
                        <input type="text" class="form-control" name="search" placeholder="Tìm kiếm..." value="<?= htmlspecialchars($searchQuery) ?>">
                        <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                    </div>
                </form>

                <?php if ($selectedCategory == "dongco"): ?>
                    <h4>Động cơ</h4>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Model</th>
                                <th>Công suất (kW)</th>
                                <th>Tốc độ (RPM)</th>
                                <th>Điện áp (V)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{Model}</td>
                                <td>{Công suất}</td>
                                <td>{Tốc độ}</td>
                                <td>{Điện áp}</td>
                            </tr>
                            <tr>
                                <td>{Model}</td>
                                <td>{Công suất}</td>
                                <td>{Tốc độ}</td>
                                <td>{Điện áp}</td>
                            </tr>
                        </tbody>
                    </table>

                <?php elseif ($selectedCategory == "banhRang"): ?>
                    <h4>Bánh răng</h4>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Loại</th>
                                <th>Mô đun (m)</th>
                                <th>Số răng</th>
                                <th>Vật liệu</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{Loại}</td>
                                <td>{Mô đun}</td>
                                <td>{Số răng}</td>
                                <td>{Vật liệu}</td>
                            </tr>
                            <tr>
                                <td>{Loại}</td>
                                <td>{Mô đun}</td>
                                <td>{Số răng}</td>
                                <td>{Vật liệu}</td>
                            </tr>
                        </tbody>
                    </table>

                <?php elseif ($selectedCategory == "oTruc"): ?>
                    <h4>Ổ trục</h4>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Loại</th>
                                <th>Đường kính trong (mm)</th>
                                <th>Đường kính ngoài (mm)</th>
                                <th>Chiều rộng (mm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{Loại}</td>
                                <td>{Đường kính trong}</td>
                                <td>{Đường kính ngoài}</td>
                                <td>{Chiều rộng}</td>
                            </tr>
                            <tr>
                                <td>{Loại}</td>
                                <td>{Đường kính trong}</td>
                                <td>{Đường kính ngoài}</td>
                                <td>{Chiều rộng}</td>
                            </tr>
                        </tbody>
                    </table>
                <?php endif; ?>
            </main>
        </div>
    </div>

    <?php include 'components/footer.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
