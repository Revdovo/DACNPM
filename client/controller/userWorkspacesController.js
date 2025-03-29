document.addEventListener("DOMContentLoaded", function () {
    loadWorkspaces();
    document.querySelector(".btn-create").addEventListener("click", createWorkspace);
});

function loadWorkspaces() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || "your"; // Mặc định là "your"
    const title = document.getElementById("workspace-title");
    const container = document.getElementById("workspace-list");

    if (!container || !title) return;

    if (type === "your") {
        title.innerText = "Danh sách Workspace của bạn";
        fetch("api.php?action=get_user_workspaces")
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("workspace-list");
                container.innerHTML = "";

                // Kiểm tra nếu `data.data` là mảng và có phần tử
                if (Array.isArray(data.data) && data.data.length > 0) {
                    data.data.forEach(workspace => {
                        container.innerHTML += `
                            <div class="workspace-item border p-3 mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <p class="mb-1"><strong>Mã:</strong> ${workspace.code}</p>
                                    <p class="mb-0">Trạng thái: ${workspace.status}</p>
                                </div>
                                <div>
                                    <button class="btn btn-warning" onclick="enterWorkspace('${workspace.code}')">Vào</button>
                                    <button class="btn btn-danger" onclick="deleteWorkspace(${workspace.id})">Xóa</button>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    // Nếu không có workspace nào, hiển thị thông báo
                    container.innerHTML = `<p class="text-muted">Bạn chưa có workspace nào.</p>`;
                }
            })
            .catch(error => console.error("Lỗi khi tải workspace:", error));
    } else {
        title.innerText = "Danh sách Workspace khác";
        fetch("api.php?action=get_guest_workspaces")
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById("workspace-list");
                container.innerHTML = "";

                if (Array.isArray(data.data) && data.data.length > 0) {
                    data.data.forEach(workspace => {
                        container.innerHTML += `
                            <div class="workspace-item border p-3 mb-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <p class="mb-1"><strong>Mã:</strong> ${workspace.code}</p>
                                    <p class="mb-0">Trạng thái: ${workspace.status}</p>
                                </div>
                                <div>
                                    <button class="btn btn-warning" onclick="enterWorkspace('${workspace.code}')">Vào</button>
                                    <button class="btn btn-danger" onclick="leaveWorkspace(${workspace.id})">Rời</button>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    container.innerHTML = `<p class="text-muted">Bạn chưa tham gia workspace nào.</p>`;
                }
            })
            .catch(error => console.error("Lỗi khi tải guest workspace:", error));

    }
}

function enterWorkspace(code) {
    window.location.href = `design.php?code=${code}`;
}

function deleteWorkspace(workspaceId) {
    if (!confirm("Bạn có chắc chắn muốn xóa workspace này?")) return;

    fetch("api.php?action=delete_workspace", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: workspaceId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Xóa workspace thành công!");
            loadWorkspaces();
        } else {
            alert("Lỗi khi xóa workspace: " + data.message);
        }
    })
    .catch(error => console.error("Lỗi khi xóa workspace:", error));
}

function leaveWorkspace(workspaceId) {
    if (!confirm("Bạn có chắc chắn muốn rời khỏi workspace này?")) return;

    fetch("api.php?action=leave_workspace", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: workspaceId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Rời khỏi workspace thành công!");
            loadWorkspaces();
        } else {
            alert("Lỗi khi rời khỏi workspace: " + data.message);
        }
    })
    .catch(error => console.error("Lỗi khi rời khỏi workspace:", error));
}

function createWorkspace() {
    fetch("api.php?action=create_workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Tạo workspace thành công!");
            loadWorkspaces();
        } else {
            alert("Lỗi khi tạo workspace: " + data.message);
        }
    })
    .catch(error => console.error("Lỗi khi tạo workspace:", error));
}
