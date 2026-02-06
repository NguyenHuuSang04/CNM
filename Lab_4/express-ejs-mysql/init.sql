-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu cho users
INSERT INTO users (username, password) VALUES 
('admin', '123456'),
('user1', 'password123');

-- Thêm dữ liệu mẫu cho products
INSERT INTO products (name, price, quantity) VALUES 
('Laptop Dell XPS 13', 25000000, 10),
('iPhone 15 Pro', 30000000, 15),
('Samsung Galaxy S24', 22000000, 20),
('iPad Air M2', 15000000, 12);
