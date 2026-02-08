# 🚀 QUICK START GUIDE

## ✅ Dự án đã được khởi tạo thành công!

### 📦 Các bước đã hoàn thành:
- ✅ Tạo cấu trúc dự án MVC
- ✅ Cấu hình Docker Compose
- ✅ Khởi tạo bảng Products trong DynamoDB
- ✅ API CRUD hoạt động hoàn hảo

---

## 🎯 Sử dụng nhanh:

### 1. Khởi động dự án
```powershell
docker-compose up -d
```

### 2. Kiểm tra trạng thái
```powershell
docker-compose ps
```

### 3. Xem logs
```powershell
# Logs của API server
docker-compose logs app -f

# Logs của DynamoDB
docker-compose logs dynamodb-local
```

---

## 🔧 API Endpoints

**Base URL:** `http://localhost:3000`

### 1. Lấy tất cả sản phẩm
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/products
```

### 2. Tạo sản phẩm mới
```powershell
$body = @{
    name = 'Laptop Dell XPS'
    price = 1200
    url_image = 'https://example.com/laptop.jpg'
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/products `
    -Method Post `
    -Body $body `
    -ContentType 'application/json'
```

### 3. Lấy sản phẩm theo ID
```powershell
$productId = 'your-product-id-here'
Invoke-RestMethod -Uri "http://localhost:3000/api/products/$productId"
```

### 4. Cập nhật sản phẩm
```powershell
$productId = 'your-product-id-here'
$body = @{
    name = 'Updated Product'
    price = 1500
    url_image = 'https://example.com/new-image.jpg'
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products/$productId" `
    -Method Put `
    -Body $body `
    -ContentType 'application/json'
```

### 5. Xóa sản phẩm
```powershell
$productId = 'your-product-id-here'
Invoke-RestMethod -Uri "http://localhost:3000/api/products/$productId" `
    -Method Delete
```

---

## 📊 Cấu trúc Database

**Bảng:** Products

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary Key - tự động sinh |
| name | String | Tên sản phẩm |
| price | Number | Giá sản phẩm |
| url_image | String | URL hình ảnh |
| createdAt | String (ISO) | Thời gian tạo |
| updatedAt | String (ISO) | Thời gian cập nhật |

---

## 🛠️ Quản lý Container

### Dừng containers
```powershell
docker-compose stop
```

### Khởi động lại
```powershell
docker-compose start
```

### Xóa containers (giữ data)
```powershell
docker-compose down
```

### Xóa containers và data
```powershell
docker-compose down -v
```

### Rebuild containers
```powershell
docker-compose up -d --build
```

---

## 🔄 Reset Database

Nếu muốn reset database hoàn toàn:

```powershell
# 1. Xóa containers và volumes
docker-compose down -v

# 2. Khởi động lại
docker-compose up -d

# 3. Đợi 5 giây cho containers khởi động
Start-Sleep -Seconds 5

# 4. Khởi tạo lại bảng Products
docker-compose exec app npm run init-db
```

---

## 📝 Environment Variables (.env)

```env
# DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_ENDPOINT=http://dynamodb-local:8000

# Application Configuration
PORT=3000
NODE_ENV=development

# Table Name
DYNAMODB_TABLE_NAME=Products
```

**⚠️ Lưu ý:** Credentials `test` chỉ dùng cho DynamoDB Local, không cần credentials thật.

---

## 🎓 Kiến trúc MVC

```
├── models/          # Model - Định nghĩa data và business logic
│   └── Product.js
├── controllers/     # Controller - Xử lý request/response
│   └── productController.js
├── routes/         # Routes - Định nghĩa API endpoints
│   └── productRoutes.js
├── config/         # Configuration
│   └── database.js
└── server.js       # Entry point
```

---

## ❓ Troubleshooting

### Lỗi: Container không khởi động
```powershell
docker-compose logs app
docker-compose logs dynamodb-local
```

### Lỗi: Không kết nối được DynamoDB
```powershell
# Restart containers
docker-compose restart

# Hoặc recreate
docker-compose down
docker-compose up -d
```

### Lỗi: Port đã được sử dụng
Thay đổi port trong docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Thay vì 3000:3000
```

---

## 📚 Tài liệu đầy đủ

Xem file [README.md](README.md) để biết thêm chi tiết.

---

## ✅ Test nhanh

```powershell
# Test tạo product
$body = @{name='Test Product';price=100;url_image='https://example.com/test.jpg'} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/products -Method Post -Body $body -ContentType 'application/json'

# Test lấy tất cả products
Invoke-RestMethod -Uri http://localhost:3000/api/products
```

---

**🎉 Chúc bạn code vui vẻ!**
