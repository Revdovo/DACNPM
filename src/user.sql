CREATE DATABASE IF NOT EXISTS mydatabase;

USE mydatabase;

CREATE TABLE users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user' -- Phân quyền người dùng
);

CREATE TABLE workspace (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Chủ sở hữu workspace
    num1 INT NOT NULL,
    num2 INT NOT NULL,
    num3 INT NOT NULL,
    result VARCHAR(255),  
    status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending', 
    step INT NOT NULL DEFAULT 0, -- Tiến trình tính toán
    code VARCHAR(255) UNIQUE NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE
);

CREATE TABLE workspace_guests (
    workspace_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (workspace_id, user_id), -- Đảm bảo mỗi khách chỉ được thêm 1 lần vào workspace
    FOREIGN KEY (workspace_id) REFERENCES workspace(entry_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY (workspace_id) REFERENCES workspace(entry_id) ON DELETE CASCADE
);
