document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.getElementById("workspaceCode");
    const joinButton = document.getElementById("joinButton");

    joinButton.addEventListener("click", function() {
        const code = inputField.value.trim();

        if (/^\d{6}$/.test(code)) {
            fetch("api.php?action=check_workspace", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "code=" + encodeURIComponent(code)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.status === "success") {
                    window.location.href = "design.php?code=" + code;
                }
            })
            .catch(error => console.error("Lỗi:", error));
        } else {
            alert("Mã phòng phải gồm đúng 6 số!");
        }
    });
});
