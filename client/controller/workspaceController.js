document.addEventListener("DOMContentLoaded", function () {
    loadWorkspaces();
});

async function loadWorkspaces() {
    try {
        const response = await fetch("/server/ListWorkspaces.php");
        const data = await response.json();

        console.log("DEBUG: Dữ liệu workspace nhận được:", data); // Debug dữ liệu từ API

        const list = document.getElementById("workspaceList");
        list.innerHTML = "";

        if (!data.success || !data.workspaces.length) {
            list.innerHTML = `<li class="list-group-item text-danger">Không có workspace nào!</li>`;
            return;
        }

        data.workspaces.forEach(workspace => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.textContent = `Mã: ${workspace.code}`;

            // Tạo nút quản lý workspace
            const btn = document.createElement("button");
            btn.classList.add("btn", workspace.owned ? "btn-danger" : "btn-warning");
            btn.textContent = workspace.owned ? "Xóa" : "Rời khỏi";
            btn.onclick = () => manageWorkspace(workspace.entry_id, workspace.owned);

            li.appendChild(btn);
            list.appendChild(li);
        });

    } catch (error) {
        console.error("Lỗi khi tải workspace:", error);
    }
}

// Xử lý khi nhấn "Xóa" hoặc "Rời khỏi"
async function manageWorkspace(entryId, isOwner) {
    const url = isOwner ? "/server/DeleteWorkspace.php" : "/server/LeaveWorkspace.php";
    const formData = new FormData();
    formData.append("entry_id", entryId);

    try {
        const response = await fetch(url, { method: "POST", body: formData });
        const data = await response.json();

        if (data.success) {
            alert("Thành công! Đang tải lại danh sách...");
            loadWorkspaces();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (error) {
        console.error("Lỗi khi quản lý workspace:", error);
    }
}

async function createWorkspace() {
    try {
        const response = await fetch("/server/CreateWorkspace.php", { method: "POST" });
        const data = await response.json();

        if (data.success) {
            alert(`Tạo workspace thành công! Mã: ${data.code}`);
            loadWorkspaces();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (error) {
        console.error("Lỗi khi tạo workspace:", error);
    }
}

async function joinWorkspace() {
    const joinCode = document.getElementById("joinCode").value.trim();
    if (!joinCode) {
        alert("Vui lòng nhập mã workspace!");
        return;
    }

    const formData = new FormData();
    formData.append("code", joinCode);

    try {
        const response = await fetch("/server/JoinWorkspace.php", { method: "POST", body: formData });
        const data = await response.json();

        if (data.success) {
            alert("Tham gia thành công!");
            loadWorkspaces();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (error) {
        console.error("Lỗi khi tham gia workspace:", error);
    }
}
