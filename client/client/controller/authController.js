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
        messageDiv.innerHTML = "";

        try {
            const response = await fetch("./api.php?action=signin", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            messageDiv.innerHTML = `<p class="${result.success ? 'text-success' : 'text-danger'}">${result.message}</p>`;

            if (result.success) {
                setTimeout(() => location.reload(), 1000);
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            messageDiv.innerHTML = '<p class="text-danger">Lỗi máy chủ!</p>';
        }
    });

    // Xử lý đăng ký
    document.getElementById("signUpForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const messageDiv = document.getElementById("signUpMessage");
        messageDiv.innerHTML = "";

        try {
            const response = await fetch("./api.php?action=signup", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            messageDiv.innerHTML = `<p class="${result.success ? 'text-success' : 'text-danger'}">${result.message}</p>`;

            if (result.success) {
                setTimeout(() => location.reload(), 1000);
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            messageDiv.innerHTML = '<p class="text-danger">Lỗi máy chủ!</p>';
        }
    });

    // Đăng xuất
    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
        try {
            const response = await fetch("./api.php?action=signout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Lỗi HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                setTimeout(() => location.reload(), 500);
            } else {
                console.error("Lỗi đăng xuất:", result.message);
            }
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    });
});
