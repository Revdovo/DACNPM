document.addEventListener("DOMContentLoaded", () => { 
    document.getElementById("loginBtn")?.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("signInModal")).show();
    });

    document.getElementById("registerBtn")?.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("signUpModal")).show();
    });

    // Xử lý đăng nhập
    document.getElementById("signInForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const messageDiv = document.getElementById("signInMessage"); 
        messageDiv.innerHTML = ""; // Xóa thông báo cũ

        try {
            const response = await fetch("./../../server/SignInData.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            messageDiv.innerHTML = `<p class="${result.success ? 'text-success' : 'text-danger'}">${result.message}</p>`;

            if (result.success) {
                setTimeout(() => location.reload(), 1000); // Reload sau 1s
            }
        } catch (error) {
            messageDiv.innerHTML = '<p class="text-danger">Lỗi máy chủ!</p>';
        }
    });

    // Xử lý đăng ký
    document.getElementById("signUpForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const messageDiv = document.getElementById("signUpMessage");
        messageDiv.innerHTML = ""; // Xóa thông báo cũ

        try {
            const response = await fetch("./../../server/SignUpData.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            messageDiv.innerHTML = `<p class="${result.success ? 'text-success' : 'text-danger'}">${result.message}</p>`;

            if (result.success) {
                setTimeout(() => location.reload(), 1000); // Reload sau 1s
            }
        } catch (error) {
            messageDiv.innerHTML = '<p class="text-danger">Lỗi máy chủ!</p>';
        }
    });
});
