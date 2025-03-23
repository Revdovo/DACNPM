document.addEventListener("DOMContentLoaded", function () {
    const workspaceCodeDisplay = document.getElementById("workspaceCodeDisplay");
    const workspaceStatus = document.getElementById("workspaceStatus");
    const calculationForm = document.getElementById("calculationForm");

    // Lấy mã workspace từ URL (nếu có)
    const urlParams = new URLSearchParams(window.location.search);
    const workspaceCode = urlParams.get("code") || "default123";

    // Hiển thị mã Workspace
    workspaceCodeDisplay.value = workspaceCode;

    // Lấy dữ liệu Workspace từ API
    async function fetchWorkspaceData() {
        try {
            const response = await fetch(`api.php?action=getWorkspace&code=${workspaceCode}`);
            const data = await response.json();

            if (data.success) {
                workspaceStatus.innerHTML = `<strong>Trạng thái:</strong> <span class="text-uppercase">${data.workspace.status}</span>`;
            } else {
                workspaceStatus.innerHTML = `<strong class="text-danger">Không tìm thấy workspace.</strong>`;
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu workspace:", error);
            workspaceStatus.innerHTML = `<strong class="text-danger">Lỗi kết nối server.</strong>`;
        }
    }

    fetchWorkspaceData();

    // Cho phép sao chép mã Workspace khi click vào
    workspaceCodeDisplay.addEventListener("click", () => {
        navigator.clipboard.writeText(workspaceCode)
            .then(() => {
                alert("Mã Workspace đã được sao chép!");
            })
            .catch((error) => {
                console.error("Lỗi sao chép mã workspace:", error);
            });
    });

    // Gửi dữ liệu tính toán lên server qua api.php
    calculationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(calculationForm);
        const num1 = formData.get("num1");
        const num2 = formData.get("num2");
        const num3 = formData.get("num3");

        try {
            const response = await fetch("api.php?action=updateWorkspace", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: workspaceCode, num1, num2, num3 })
            });
            
            const data = await response.json();
            if (data.success) {
                alert("Cập nhật dữ liệu thành công!");
                fetchWorkspaceData(); // Cập nhật trạng thái
            } else {
                alert(`Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
            alert("Không thể kết nối server.");
        }
    });
});
