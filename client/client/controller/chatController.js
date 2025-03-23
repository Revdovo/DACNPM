document.addEventListener("DOMContentLoaded", function () {
    const chatBubble = document.getElementById('chat-bubble');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.getElementById('closeChat');

    const botChat = document.getElementById('botChat');
    const chatTitle = document.getElementById('chatTitle');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');

    let currentChat = "bot"; // Mặc định là bot chat

    // Hiển thị chat box khi nhấn vào bong bóng
    chatBubble.addEventListener('click', function () {
        chatBox.classList.remove('d-none');
        chatBubble.classList.add('d-none');
    });

    // Đóng hộp chat khi nhấn vào nút đóng
    closeChat.addEventListener('click', function () {
        chatBox.classList.add('d-none');
        chatBubble.classList.remove('d-none');
    });

    // Chuyển sang bot chat
    botChat.addEventListener('click', function () {
        switchChat("bot", "Bot hỗ trợ", "Xin chào! Tôi là trợ lý của bạn.");
    });

    // Gửi tin nhắn
    sendMessage.addEventListener('click', function () {
        sendChatMessage();
    });

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendChatMessage();
        }
    });

    function sendChatMessage() {
        let message = chatInput.value.trim();
        if (message === "") return;

        // Hiển thị tin nhắn của người dùng
        chatMessages.innerHTML += `<div class="user-message">${message}</div>`;
        chatInput.value = "";

        // Xử lý phản hồi từ bot
        if (currentChat === "bot") {
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                chatMessages.innerHTML += `<div class="bot-message">${botResponse}</div>`;

                // Cuộn xuống tin nhắn mới nhất
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        }
    }

    function switchChat(id, title, welcomeMessage) {
        currentChat = id;
        chatTitle.textContent = title;
        chatMessages.innerHTML = `<p class="text-muted text-center">${welcomeMessage}</p>`;

        document.querySelectorAll('.chat-avatar').forEach(btn => btn.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    // Xử lý phản hồi bot dựa trên từ khóa
    function getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase(); // Chuyển đổi thành chữ thường để dễ kiểm tra

        // Từ khóa về lời chào
        const greetingKeywords = ["xin chào", "hello", "hi", "chào bot", "chào bạn", "alo", "bot ơi"];
        // Từ khóa liên quan đến cách sử dụng
        const usageKeywords = ["cách dùng", "hướng dẫn", "sử dụng", "làm sao", "dùng như thế nào"];
        // Từ khóa liên quan đến mục đích của công cụ
        const purposeKeywords = ["công cụ này để làm gì", "công cụ này dùng để làm gì", "chức năng", "tính năng"];
        // Từ khóa về lịch sử tính toán
        const historyKeywords = ["lịch sử", "xem lại", "tính toán trước", "kết quả cũ"];
        // Từ khóa về xuất file PDF
        const exportKeywords = ["xuất file", "xuất pdf", "lưu file", "tải pdf"];

        if (greetingKeywords.some(keyword => userMessage.includes(keyword))) {
            const responses = [
                "Xin chào! Tôi có thể giúp gì cho bạn?",
                "Chào bạn! Hôm nay bạn cần hỗ trợ gì?",
                "Xin chào! Tôi là trợ lý ảo của bạn.",
                "Chào bạn! Bạn đang gặp vấn đề gì với công cụ này?",
                "Hello! Tôi có thể giúp gì cho bạn hôm nay?"
            ];
            return responses[Math.floor(Math.random() * responses.length)]; // Trả lời ngẫu nhiên một câu chào
        } else if (usageKeywords.some(keyword => userMessage.includes(keyword))) {
            return `Tôi có thể hỗ trợ bạn sử dụng công cụ thiết kế này.<br><br>
            <b>Hướng dẫn sử dụng:</b><br>
            1️⃣ Nhập 3 thông số cần thiết để tạo workspace.<br>
            2️⃣ Kiểm tra giới hạn thông số.<br>
            3️⃣ Chọn linh kiện tự động hoặc thủ công.<br>
            4️⃣ Tiến hành từng bước tính toán.<br>
            5️⃣ Nếu hoàn thành, sẽ hiển thị minh họa và thông số.<br>`;
        } else if (purposeKeywords.some(keyword => userMessage.includes(keyword))) {
            return "Công cụ này dùng để tính toán và hỗ trợ thiết kế hộp giảm tốc.";
        } else if (historyKeywords.some(keyword => userMessage.includes(keyword))) {
            return `🔍 Bạn có thể xem lại lịch sử tính toán bằng nút Lịch Sử trên thanh công cụ`;
        } else if (exportKeywords.some(keyword => userMessage.includes(keyword))) {
            return `📄 Bạn có thể xuất file dưới dạng PDF bằng nút Xuất PDF. File này sẽ chứa thông tin về các số liệu bạn đã tính toán được.`;
        } else {
            return "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể thử lại với một câu hỏi khác!";
        }
    }
});
