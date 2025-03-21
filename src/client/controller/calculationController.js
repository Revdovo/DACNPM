document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculationForm");

    if (!form) {
        showMessage("Lỗi", "Không tìm thấy form!", "bg-danger text-white");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost/server/CalculationHandler.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                showMessage("Thành công", "Dữ liệu đã được lưu!", "bg-success text-white");
            } else {
                showMessage("Lỗi", data.message, "bg-danger text-white");
            }
        } catch (error) {
            showMessage("Lỗi", "Lỗi kết nối máy chủ!", "bg-danger text-white");
        }
    });
});

/**
 * Hiển thị modal Bootstrap
 * @param {string} title - Tiêu đề modal
 * @param {string} message - Nội dung modal
 * @param {string} headerClass - Class Bootstrap cho header (bg-success, bg-danger, ...)
 */
function showMessage(title, message, headerClass) {
    document.getElementById("messageTitle").textContent = title;
    document.getElementById("messageContent").textContent = message;

    const messageHeader = document.getElementById("messageHeader");
    messageHeader.className = "modal-header " + headerClass;

    const messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
    messageModal.show();
}
