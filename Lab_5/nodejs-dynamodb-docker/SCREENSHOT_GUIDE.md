# 📸 HƯỚNG DẪN CHỤP ẢNH NỘP BÀI

## 📋 YÊU CẦU ĐỀ BÀI

Nộp file Word có:
1. ✅ Hình DynamoDB trên Docker
2. ✅ Hình chạy chương trình
3. ✅ Link GitHub

---

## 🎯 PHẦN 1: CHỤP HÌNH DYNAMODB TRÊN DOCKER

### Ảnh 1: Danh sách Containers đang chạy

**Lệnh:**
```powershell
docker-compose ps
```

**Chụp ảnh bao gồm:**
- ✅ NAME: `dynamodb-local` và `nodejs-app`
- ✅ IMAGE: `amazon/dynamodb-local:latest`
- ✅ STATUS: `Up X seconds`
- ✅ PORTS: `8000:8000` và `3000:3000`

**📸 Screenshot nên chứa toàn bộ output của lệnh**

---

### Ảnh 2: DynamoDB Container Logs

**Lệnh:**
```powershell
docker-compose logs dynamodb-local
```

**Chụp ảnh chứa:**
- ✅ `Initializing DynamoDB Local`
- ✅ `Port: 8000`
- ✅ `SharedDb: true`
- ✅ Không có lỗi (error)

---

### Ảnh 3: Bảng Products trong DynamoDB

**Lệnh kiểm tra bảng:**
```powershell
docker-compose exec app node -e "const AWS = require('aws-sdk'); AWS.config.update({region: 'us-east-1', endpoint: 'http://dynamodb-local:8000', accessKeyId: 'test', secretAccessKey: 'test'}); const db = new AWS.DynamoDB(); db.listTables((e,d) => console.log('Tables:', d.TableNames));"
```

**Hoặc đơn giản hơn:**
```powershell
docker-compose exec app npm run init-db
```

**Chụp ảnh chứa:**
- ✅ `Table "Products" already exists!` hoặc
- ✅ `Table "Products" created successfully!`
- ✅ Output cho thấy bảng Products đã được tạo

---

### Ảnh 4: Cấu trúc Docker Compose

**Mở file docker-compose.yml và chụp màn hình**

**Cần thấy:**
```yaml
services:
  dynamodb-local:
    image: amazon/dynamodb-local:latest
    ports:
      - "8000:8000"
  
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - dynamodb-local
```

---

### Ảnh 5: File .env chứa thông tin đăng nhập

**Mở file .env và chụp:**

**Nội dung cần thấy:**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_ENDPOINT=http://dynamodb-local:8000
PORT=3000
DYNAMODB_TABLE_NAME=Products
```

---

## 🎯 PHẦN 2: CHỤP HÌNH CHẠY CHƯƠNG TRÌNH

### Ảnh 6: API Server đang chạy

**Lệnh:**
```powershell
docker-compose logs app --tail=20
```

**Chụp ảnh chứa:**
- ✅ `Server is running on port 3000`
- ✅ `DynamoDB endpoint: http://dynamodb-local:8000`
- ✅ Không có lỗi

---

### Ảnh 7: Test API - GET All Products

**Lệnh:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/products | ConvertTo-Json
```

**Chụp ảnh chứa:**
```json
{
  "success": true,
  "count": X,
  "data": [...]
}
```

---

### Ảnh 8: Test API - POST Create Product

**Lệnh:**
```powershell
$body = @{name='Test Product';price=100;url_image='https://example.com/test.jpg'} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/products -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json
```

**Chụp ảnh chứa:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-generated",
    "name": "Test Product",
    "price": 100,
    ...
  }
}
```

---

### Ảnh 9: Giao diện Web GUI đầy đủ

**Mở browser:** `http://localhost:3000`

**Chụp toàn bộ màn hình bao gồm:**
- ✅ Form thêm sản phẩm (phía trên)
- ✅ Danh sách sản phẩm (phía dưới)
- ✅ Ít nhất 2-3 sản phẩm trong danh sách
- ✅ URL trên thanh địa chỉ: `localhost:3000`

**💡 Tip:** Thêm vài sản phẩm mẫu trước khi chụp để đẹp hơn!

---

### Ảnh 10: Demo THÊM Sản Phẩm

**Bước 1:** Điền form với thông tin:
```
Tên: Laptop Dell XPS 15
Giá: 1200
URL: https://images.unsplash.com/photo-1593642632823-8f785ba67e45
```

**Bước 2:** Chụp màn hình trước khi click "Thêm Sản Phẩm"

---

### Ảnh 11: Thông báo Thêm Thành Công

**Chụp màn hình ngay sau khi thêm sản phẩm**

**Cần thấy:**
- ✅ Toast notification: "Thêm sản phẩm thành công!"
- ✅ Sản phẩm mới xuất hiện trong danh sách

---

### Ảnh 12: Demo SỬA Sản Phẩm

**Bước 1:** Click nút "Sửa" (màu vàng) của 1 sản phẩm

**Chụp màn hình form đã được điền sẵn:**
- ✅ Tiêu đề form: "Cập Nhật Sản Phẩm"
- ✅ Các trường đã có dữ liệu
- ✅ Có nút "Cập Nhật" và "Hủy"

---

### Ảnh 13: Demo XÓA Sản Phẩm

**Bước 1:** Click nút "Xóa" (màu đỏ)

**Chụp màn hình popup xác nhận:**
- ✅ "Bạn có chắc muốn xóa sản phẩm này?"
- ✅ Hiển thị thông tin sản phẩm sắp xóa

---

### Ảnh 14: Cấu trúc Project MVC

**Mở VS Code và chụp cây thư mục:**

```
nodejs-dynamodb-docker/
├── config/
│   └── database.js
├── controllers/
│   └── productController.js
├── models/
│   └── Product.js
├── routes/
│   └── productRoutes.js
├── public/
│   └── index.html
├── scripts/
│   └── initDatabase.js
├── .env
├── docker-compose.yml
├── Dockerfile
├── package.json
└── server.js
```

---

### Ảnh 15: Code Model - Product.js

**Mở file `models/Product.js` và chụp:**

**Cần thấy các method:**
- ✅ `getAll()`
- ✅ `getById(id)`
- ✅ `create(productData)`
- ✅ `update(id, productData)`
- ✅ `delete(id)`

---

### Ảnh 16: Code Controller - productController.js

**Mở file `controllers/productController.js` và chụp:**

**Cần thấy các function:**
- ✅ `getAllProducts`
- ✅ `getProductById`
- ✅ `createProduct`
- ✅ `updateProduct`
- ✅ `deleteProduct`

---

### Ảnh 17: Code Routes - productRoutes.js

**Mở file `routes/productRoutes.js` và chụp:**

**Cần thấy:**
```javascript
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
```

---

### Ảnh 18: Database Config

**Mở file `config/database.js` và chụp:**

**Cần thấy:**
- ✅ AWS SDK configuration
- ✅ DynamoDB endpoint
- ✅ Credentials từ environment variables

---

## 🎯 PHẦN 3: CHUẨN BỊ LINK GITHUB

### Bước 1: Tạo Repository trên GitHub

1. Truy cập: https://github.com/new
2. Tên repo: `nodejs-dynamodb-crud-docker`
3. Description: `CRUD Node.js with DynamoDB and Docker`
4. Chọn: **Public**
5. Click **"Create repository"**

---

### Bước 2: Push Code lên GitHub

**Mở PowerShell trong thư mục project:**

```powershell
# 1. Khởi tạo Git (nếu chưa có)
git init

# 2. Tạo file .gitignore (nếu chưa có)
@"
node_modules/
.env
*.log
.DS_Store
"@ | Out-File -FilePath .gitignore -Encoding utf8

# 3. Add tất cả files
git add .

# 4. Commit
git commit -m "Initial commit: CRUD Node.js + DynamoDB + Docker"

# 5. Link với GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/nodejs-dynamodb-crud-docker.git

# 6. Push lên GitHub
git branch -M main
git push -u origin main
```

**⚠️ Lưu ý:** Thay `YOUR_USERNAME` bằng username GitHub của bạn

---

### Ảnh 19: GitHub Repository

**Chụp màn hình GitHub repository:**

**Cần thấy:**
- ✅ Tên repository
- ✅ Description
- ✅ Cây thư mục đầy đủ
- ✅ README.md file
- ✅ Số commits
- ✅ URL repository rõ ràng

---

### Ảnh 20: GitHub - Files Structure

**Chụp màn hình cây thư mục trên GitHub:**

**Cần thấy các folder/file:**
- ✅ config/
- ✅ controllers/
- ✅ models/
- ✅ routes/
- ✅ public/
- ✅ scripts/
- ✅ docker-compose.yml
- ✅ package.json
- ✅ README.md

---

## 📝 TẠO FILE WORD ĐỂ NỘP

### Cấu trúc File Word

```
═══════════════════════════════════════
  BÀI TẬP LẬP TRÌNH MẠNG - LAB 5
  CRUD Node.js + DynamoDB + Docker
═══════════════════════════════════════

Họ và tên: [Tên của bạn]
MSSV: [Mã số sinh viên]
Lớp: [Tên lớp]
Ngày nộp: [Ngày/tháng/năm]

───────────────────────────────────────
PHẦN 1: DYNAMODB TRÊN DOCKER
───────────────────────────────────────

1.1. Docker Containers đang chạy
[Ảnh 1 - docker-compose ps]

1.2. DynamoDB Container Logs
[Ảnh 2 - logs dynamodb]

1.3. Bảng Products trong DynamoDB
[Ảnh 3 - init-db output]

1.4. File docker-compose.yml
[Ảnh 4 - docker-compose.yml content]

1.5. File .env (Thông tin đăng nhập)
[Ảnh 5 - .env file]

───────────────────────────────────────
PHẦN 2: CHẠY CHƯƠNG TRÌNH
───────────────────────────────────────

2.1. API Server Running
[Ảnh 6 - Server logs]

2.2. Test API - GET Products
[Ảnh 7 - GET request result]

2.3. Test API - POST Create Product
[Ảnh 8 - POST request result]

2.4. Giao diện Web - Tổng quan
[Ảnh 9 - Full GUI screenshot]

2.5. Demo THÊM sản phẩm
[Ảnh 10 - Form điền dữ liệu]
[Ảnh 11 - Notification thành công]

2.6. Demo SỬA sản phẩm
[Ảnh 12 - Edit form]

2.7. Demo XÓA sản phẩm
[Ảnh 13 - Delete confirmation]

───────────────────────────────────────
PHẦN 3: KIẾN TRÚC MVC
───────────────────────────────────────

3.1. Cấu trúc Project
[Ảnh 14 - Folder structure]

3.2. Model Layer
[Ảnh 15 - Product.js code]

3.3. Controller Layer
[Ảnh 16 - productController.js code]

3.4. Routes Layer
[Ảnh 17 - productRoutes.js code]

3.5. Database Configuration
[Ảnh 18 - database.js code]

───────────────────────────────────────
PHẦN 4: GITHUB REPOSITORY
───────────────────────────────────────

4.1. GitHub Repository Overview
[Ảnh 19 - GitHub repo page]

4.2. GitHub Files Structure
[Ảnh 20 - GitHub file tree]

Link GitHub Repository:
https://github.com/YOUR_USERNAME/nodejs-dynamodb-crud-docker

───────────────────────────────────────
KẾT LUẬN
───────────────────────────────────────

Đã hoàn thành:
✅ Tạo dự án CRUD với Node.js và Express
✅ Sử dụng DynamoDB Local trên Docker
✅ Áp dụng kiến trúc MVC
✅ Tạo file docker-compose.yml
✅ Lưu credentials trong file .env
✅ Tạo bảng Products (id, name, price, url_image)
✅ Xây dựng giao diện web để test CRUD
✅ Push code lên GitHub

═══════════════════════════════════════
```

---

## 📋 CHECKLIST TRƯỚC KHI NỘP

### ✅ Docker & DynamoDB
- [ ] Containers đang chạy (docker-compose ps)
- [ ] DynamoDB không có lỗi
- [ ] Bảng Products đã được tạo
- [ ] docker-compose.yml có đầy đủ cấu hình
- [ ] File .env có credentials

### ✅ Chương trình chạy
- [ ] Server khởi động thành công
- [ ] API GET products hoạt động
- [ ] API POST create product hoạt động  
- [ ] Giao diện web mở được
- [ ] CRUD đầy đủ: Thêm/Sửa/Xóa/Xem

### ✅ Code & Kiến trúc
- [ ] Có đầy đủ Model/Controller/Routes
- [ ] Code rõ ràng, dễ đọc
- [ ] Cấu trúc folder đúng MVC
- [ ] Database config đúng

### ✅ GitHub
- [ ] Repository đã được tạo
- [ ] Code đã push lên GitHub
- [ ] README.md đầy đủ
- [ ] Link GitHub hoạt động

### ✅ File Word
- [ ] Có đầy đủ 20 ảnh
- [ ] Ảnh rõ ràng, không bị mờ
- [ ] Có link GitHub
- [ ] Có thông tin cá nhân
- [ ] Format đẹp, dễ đọc

---

## 💡 MẸO CHỤP ẢNH ĐẸP

### 1. Độ phân giải
- Chụp toàn màn hình (không crop quá nhỏ)
- Độ phân giải ít nhất 1920x1080
- Text phải rõ ràng, không bị mờ

### 2. Nội dung
- Chụp đủ context xung quanh
- Hiển thị rõ URL/path/filename
- Không che khuất thông tin quan trọng

### 3. Terminal/PowerShell
- Font size đủ lớn để đọc
- Hiển thị prompt đầy đủ
- Có cả command và output

### 4. Browser
- Zoom 100% (không phóng to/thu nhỏ)
- Hiển thị URL bar
- Developer tools đóng lại (trừ khi cần thiết)

### 5. Code Editor
- Theme sáng hoặc tối (tùy thích)
- Font size 14-16px
- Hiển thị line numbers
- Syntax highlighting bật

---

## 🚀 LỆNH NHANH ĐỂ CHUẨN BỊ

Chạy tất cả các lệnh này trước khi chụp ảnh:

```powershell
# 1. Đảm bảo containers đang chạy
docker-compose ps

# 2. Restart để có logs sạch
docker-compose restart

# 3. Đợi 5 giây
Start-Sleep -Seconds 5

# 4. Kiểm tra logs
docker-compose logs dynamodb-local --tail=20
docker-compose logs app --tail=20

# 5. Mở browser
Start-Process "http://localhost:3000"

# 6. Thêm vài sản phẩm mẫu
$products = @(
    @{name='iPhone 15 Pro';price=999;url_image='https://images.unsplash.com/photo-1592286943541-1f8e1d4c8837'},
    @{name='MacBook Pro';price=2399;url_image='https://images.unsplash.com/photo-1517336714731-489689fd1ca8'},
    @{name='AirPods Pro';price=249;url_image='https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7'}
)

foreach ($p in $products) {
    $body = $p | ConvertTo-Json
    Invoke-RestMethod -Uri http://localhost:3000/api/products -Method Post -Body $body -ContentType 'application/json' | Out-Null
}

Write-Host "✅ Đã thêm 3 sản phẩm mẫu!" -ForegroundColor Green

# 7. Test GET
Invoke-RestMethod -Uri http://localhost:3000/api/products | ConvertTo-Json
```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. **Containers không chạy:**
   ```powershell
   docker-compose down
   docker-compose up -d
   ```

2. **API lỗi:**
   ```powershell
   docker-compose logs app
   ```

3. **DynamoDB lỗi:**
   ```powershell
   docker-compose logs dynamodb-local
   ```

4. **Giao diện không mở:**
   ```powershell
   docker-compose restart app
   Start-Sleep -Seconds 3
   Start-Process "http://localhost:3000"
   ```

---

## ✅ HOÀN TẤT

Sau khi có đủ 20 ảnh và link GitHub:
1. Tạo file Word theo template trên
2. Insert ảnh vào đúng vị trí
3. Thêm link GitHub
4. Kiểm tra lại toàn bộ
5. Export PDF (nếu cần)
6. Nộp bài!

**🎉 Chúc bạn làm bài tốt!**
