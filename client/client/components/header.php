<?php
session_start();
$isLoggedIn = isset($_SESSION['user']);
?>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.php">
            <img src="images/logoBK.png" alt="BK Logo" width="40" height="40">
            <span>Web Tính toán hộp giảm tốc</span>
        </a>

        <div class="collapse navbar-collapse justify-content-between">
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link" href="index.php">Trang chủ</a></li>
                <li class="nav-item"><a class="nav-link" href="workspace.php">Thiết kế</a></li>
                <li class="nav-item"><a class="nav-link" href="catalog.php">Catalog</a></li>
            </ul>
            <div class="d-flex">
                <?php if ($isLoggedIn): ?>
                    <span class="navbar-text text-light me-3">Chào, <?= $_SESSION['user']['name'] ?></span>
                    <button class="btn btn-outline-light" id="logoutBtn">Đăng xuất</button>
                <?php else: ?>
                    <button class="btn btn-outline-light me-2" id="loginBtn">Đăng nhập</button>
                    <button class="btn btn-outline-light" id="registerBtn">Đăng ký</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
</nav>

<?php include 'components/sign_in.php'; ?>
<?php include 'components/sign_up.php'; ?>
<script src="controller/authController.js"></script>
