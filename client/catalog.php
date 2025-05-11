<?php
// Giả sử role của người dùng được lưu trong $_SESSION['user_role']
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';

$categories = [
    "dongco" => "Động cơ",
    "banhRang" => "Bánh răng",
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

    <script src="controller/catalogController.js" defer></script>
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
                                <th>Kiểu động cơ</th>
                                <th>Công suất (kW)</th>
                                <th>Công suất (HP)</th>
                                <th>Vận tốc (50Hz)</th>
                                <th>Vận tốc (60Hz)</th>
                                <th>Hiệu suất (%)</th>
                                <th>Cos φ</th>
                                <th>I_K/I_dn</th>
                                <th>T_K/T_dn</th>
                                <th>Khối lượng (kg)</th>
                                <?php if ($isAdmin): ?>
                                    <th>Hành động</th>
                                <?php endif; ?>
                            </tr>
                        </thead>
                        <tbody id="engineTable">
                            
                        </tbody>
                    </table>

                <?php elseif ($selectedCategory == "banhRang"): ?>
                    <h4>Cơ tính vật liệu</h4>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Nhân hiệu thép</th>
                                <th>Nhiệt luyện</th>
                                <th>Kích thước S (Min - Max)</th>
                                <th>Độ rắn (Min - Max)</th>
                                <th>Giới hạn bền</th>
                                <th>Giới hạn chảy</th>
                            </tr>
                        </thead>
                        <tbody id="gearMaterialTable">

                        </tbody>
                    </table>

                <?php elseif ($selectedCategory == "oTruc"): ?>
                    
                <?php endif; ?>
            </main>
        </div>
    </div>

    <?php include 'components/footer.php'; ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
