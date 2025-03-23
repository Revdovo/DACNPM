<div id="chat-bubble" class="chat-bubble position-fixed bottom-0 end-0 m-3 p-2 bg-primary text-white rounded-circle shadow">
    <i class="bi bi-chat-dots fs-3"></i>
</div>

<div id="chat-box" class="chat-box position-fixed bottom-0 end-0 m-3 bg-light border rounded shadow d-none">
    <div class="d-flex">
        <!-- Sidebar: Avatar menu -->
        <nav class="chat-sidebar bg-secondary text-white p-2 d-flex flex-column align-items-center">
            <button class="chat-avatar active" id="botChat">
                <span class="chat-button-text">B</span>
            </button>
            <div id="workspaceList">
                <!-- Các workspace sẽ được thêm vào đây -->
            </div>
        </nav>

        <!-- Main Chat Box -->
        <div class="chat-content p-2 flex-grow-1">
            <div class="chat-header bg-primary text-white p-2 d-flex justify-content-between align-items-center">
                <strong id="chatTitle">Bot hỗ trợ</strong>
                <button class="btn btn-sm btn-close text-white" id="closeChat"></button>
            </div>

            <!-- Chat Body -->
            <div class="chat-body p-2" id="chatMessages">
                <p class="text-muted text-center">Xin chào! Tôi là trợ lý của bạn.</p>
            </div>

            <!-- Chat Input -->
            <div class="chat-footer p-2 border-top">
                <input type="text" id="chatInput" class="form-control" placeholder="Nhập tin nhắn...">
                <button class="btn btn-primary mt-2" id="sendMessage">
                    <i class="bi bi-send"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<script src="controller/chatController.js" defer></script>