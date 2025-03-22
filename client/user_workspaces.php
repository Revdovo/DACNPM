<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Workspace | My App</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom Styles -->
    <link rel="stylesheet" href="style.css">
    <style>
        .menu-left {
            background: #e9ecef;
            padding: 15px;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .menu-left .list-group {
            flex-grow: 1;
        }
        .menu-left .btn-create {
            margin-top: auto;
        }

        .workspace-container {
            min-height: 400px;
            overflow-y: auto;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .workspace-item {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .workspace-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body class="d-flex flex-column min-vh-100">
    <?php include 'components/header.php'; ?>

    <main class="container mt-4 flex-grow-1">
        <h2 class="text-primary fw-bold">Các workspace bạn đã tham gia</h2>

        <div class="row mt-3">
            <!-- Menu bên trái -->
            <div class="col-md-3">
                <div class="menu-left rounded shadow-sm">
                    <div class="list-group">
                        <a href="?type=your" class="list-group-item list-group-item-action <?= (!isset($_GET['type']) || $_GET['type'] == 'your') ? 'active' : '' ?>">Workspace của bạn</a>
                        <a href="?type=guest" class="list-group-item list-group-item-action <?= (isset($_GET['type']) && $_GET['type'] == 'guest') ? 'active' : '' ?>">Workspace khác</a>
                    </div>
                    <button class="btn btn-success w-100 btn-create" data-bs-toggle="modal" data-bs-target="#createWorkspaceModal">Tạo mới</button>
                </div>
            </div>

            <!-- Danh sách Workspace -->
            <div class="col-md-9">
                <div class="workspace-container">
                    <h4 id="workspace-title">Danh sách Workspace</h4>
                    <div id="workspace-list">
                        <p class="text-muted text-center">Đang tải...</p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <?php include 'components/footer.php'; ?>

    <!-- Modal Tạo Workspace -->
    <div class="modal fade" id="createWorkspaceModal" tabindex="-1" aria-labelledby="createWorkspaceModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createWorkspaceModalLabel">Tạo Workspace mới</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="createWorkspaceForm">
                        <div class="mb-3">
                            <label for="workspaceName" class="form-label">Tên Workspace</label>
                            <input type="text" class="form-control" id="workspaceName" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Tạo</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="controller/userWorkspacesController.js"></script>
    <script>
        document.getElementById('createWorkspaceForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('workspaceName').value.trim();
            if (!name) {
                alert("Vui lòng nhập tên workspace.");
                return;
            }

            fetch("api.php?action=create_workspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Tạo workspace thành công!");
                    document.getElementById('createWorkspaceForm').reset();
                    loadWorkspaces();
                    bootstrap.Modal.getInstance(document.getElementById('createWorkspaceModal')).hide();
                } else {
                    alert("Lỗi: " + data.message);
                }
            })
            .catch(error => console.error("Lỗi khi tạo workspace:", error));
        });
    </script>
</body>
</html>
