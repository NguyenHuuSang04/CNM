# 🚀 Hướng dẫn Setup & Chạy Project

## 📋 Prerequisites

- Node.js 18+ đã cài đặt
- AWS Account với credentials (Access Key ID, Secret Access Key)
- DynamoDB & S3 đã enable

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd express-ejs-mysql
npm install
```

### 2. Cấu hình Environment Variables
Copy `.env.example` thành `.env`:
```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=your-bucket-name
SESSION_SECRET=random_secret_string_change_this
```

### 3. Tạo DynamoDB Tables
```bash
npm run create-tables
```

**Chờ 10-15 giây** để tables trở thành ACTIVE.

### 4. Seed Dữ liệu mẫu
```bash
npm run seed
```

Tạo:
- Admin user: `admin` / `admin123`
- Staff user: `staff` / `staff123`
- 5 categories
- 7 sample products

### 5. Chạy Application
```bash
npm run dev
```

Truy cập: **http://localhost:3000**

## 🔐 Đăng nhập

### Admin (Full access):
- Username: `admin`
- Password: `admin123`

### Staff (View only):
- Username: `staff`
- Password: `staff123`

## 📊 Cấu trúc Database

### Tables được tạo:
1. **Users** - Tài khoản người dùng
   - PK: `userId`
   - Attributes: username, password (hashed), role, createdAt

2. **Categories** - Danh mục sản phẩm
   - PK: `categoryId`
   - Attributes: name, description, createdAt

3. **Products** - Sản phẩm
   - PK: `productId`
   - Attributes: name, price, quantity, categoryId, url_image, isDeleted, createdAt

4. **ProductLogs** - Audit trail
   - PK: `logId`
   - Attributes: productId, action, userId, changes, timestamp

## 🎯 Tính năng chính

### Admin có thể:
- ✅ CRUD Products (Thêm/Sửa/Xóa sản phẩm)
- ✅ Upload ảnh lên S3
- ✅ CRUD Categories
- ✅ Xem audit logs
- ✅ Tìm kiếm & lọc sản phẩm

### Staff có thể:
- ✅ Xem danh sách sản phẩm
- ✅ Xem danh sách categories
- ✅ Tìm kiếm & lọc sản phẩm
- ❌ Không thể thêm/sửa/xóa

## 🛠️ Commands Available

```bash
npm start          # Chạy production mode
npm run dev        # Chạy development mode (nodemon)
npm run create-tables  # Tạo tất cả DynamoDB tables
npm run seed       # Seed dữ liệu mẫu
```

## 🐛 Troubleshooting

### Lỗi: "The security token included in the request is invalid"
➡️ Kiểm tra lại AWS credentials trong `.env`

### Lỗi: "Cannot do operations on a non-existent table"
➡️ Chạy `npm run create-tables` và đợi tables ACTIVE

### Lỗi: "The specified bucket does not exist"
➡️ Tạo S3 bucket hoặc chỉnh sửa `S3_BUCKET_NAME` trong `.env`

### Port 3000 đang được sử dụng
➡️ Thêm `PORT=3001` vào `.env`

## 📦 Project Structure

```
express-ejs-mysql/
├── repositories/    # Data Access Layer
├── services/        # Business Logic Layer
├── controllers/     # Request Handlers
├── middlewares/     # Auth & Authorization
├── routes/          # Route Definitions
├── views/           # EJS Templates
├── config/          # AWS Configuration
├── scripts/         # Setup Scripts
└── public/          # Static Assets
```

## 🔥 Next Steps

1. Đăng nhập với admin
2. Tạo categories mới
3. Thêm products với upload ảnh
4. Test search & filter
5. Kiểm tra audit logs
6. Đăng nhập với staff để test phân quyền

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. AWS credentials đúng chưa
2. DynamoDB tables đã ACTIVE chưa
3. S3 bucket đã tồn tại chưa
4. Dependencies đã cài đủ chưa (`npm install`)

---

**Good luck! 🎉**
