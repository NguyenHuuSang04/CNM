# Express EJS MySQL - Quản lý Sản phẩm

Ứng dụng quản lý sản phẩm với Express.js, EJS và MySQL theo mô hình MVC.

## Cấu trúc MVC

```
express-ejs-mysql/
├── models/              # Models - Xử lý logic database
│   ├── user.model.js
│   └── product.model.js
├── views/               # Views - Giao diện EJS
│   ├── login.ejs
│   ├── products.ejs
│   ├── add-product.ejs
│   └── edit-product.ejs
├── controllers/         # Controllers - Xử lý logic nghiệp vụ
│   ├── auth.controller.js
│   └── product.controller.js
├── routes/             # Routes - Định tuyến đường dẫn
│   └── product.routes.js
├── db/                 # Database connection
│   └── mysql.js
├── app.js              # Entry point
├── Dockerfile          # Docker config cho Node app
├── docker-compose.yml  # Docker Compose cho Node + MySQL
└── init.sql           # Script khởi tạo database
```

## Yêu cầu

- Node.js 18+
- MySQL 8.0+ (hoặc dùng Docker)
- Docker & Docker Compose (tùy chọn)

## Cài đặt

### Cách 1: Chạy Local

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo database và bảng trong MySQL:
```sql
CREATE DATABASE shopdb;
USE shopdb;

-- Chạy các lệnh trong file init.sql
```

3. Cấu hình kết nối database trong `db/mysql.js`

4. Chạy ứng dụng:
```bash
npm start
```

5. Truy cập: http://localhost:3000/login

### Cách 2: Chạy với Docker Compose (Khuyến nghị)

1. Khởi động cả Node app và MySQL:
```bash
docker-compose up -d
```

2. Kiểm tra logs:
```bash
docker-compose logs -f
```

3. Truy cập: http://localhost:3000/login

4. Dừng services:
```bash
docker-compose down
```

5. Xóa volumes (nếu muốn reset database):
```bash
docker-compose down -v
```

## Tài khoản đăng nhập mặc định

- Username: `admin`
- Password: `123456`

hoặc

- Username: `user1`
- Password: `password123`

## Tính năng

✅ Đăng nhập với session
✅ Quản lý sản phẩm (CRUD)
✅ Cấu trúc MVC rõ ràng
✅ Docker Compose với Node + MySQL
✅ Auto-init database với dữ liệu mẫu

## Docker Commands

```bash
# Build và chạy
docker-compose up --build

# Chạy ở background
docker-compose up -d

# Xem logs
docker-compose logs -f app
docker-compose logs -f mysql

# Dừng
docker-compose stop

# Xóa containers
docker-compose down

# Xóa cả volumes
docker-compose down -v

# Restart một service
docker-compose restart app
```

## Environment Variables

Xem file `.env.example` để biết các biến môi trường cần thiết.

## Port

- App: 3000
- MySQL: 3306
