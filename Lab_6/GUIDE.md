# Hướng Dẫn Thực Hiện Project — Quản Lý Sản Phẩm

> **Stack:** Node.js · Express · EJS · DynamoDB · Amazon S3 · MVC

---

## Mục Lục

1. [Tổng Quan](#1-tổng-quan)
2. [Yêu Cầu Cài Đặt Trước](#2-yêu-cầu-cài-đặt-trước)
3. [Cấu Trúc Dự Án](#3-cấu-trúc-dự-án)
4. [Bước 1 — Chuẩn Bị AWS](#bước-1--chuẩn-bị-aws)
5. [Bước 2 — Clone / Tải Code](#bước-2--clone--tải-code)
6. [Bước 3 — Cài Đặt Dependencies](#bước-3--cài-đặt-dependencies)
7. [Bước 4 — Cấu Hình Biến Môi Trường](#bước-4--cấu-hình-biến-môi-trường)
8. [Bước 5 — Tạo Bảng DynamoDB](#bước-5--tạo-bảng-dynamodb)
9. [Bước 6 — Chạy Ứng Dụng](#bước-6--chạy-ứng-dụng)
10. [Chức Năng Ứng Dụng](#10-chức-năng-ứng-dụng)
11. [Giải Thích Kiến Trúc MVC](#11-giải-thích-kiến-trúc-mvc)
12. [Giải Thích Các File Quan Trọng](#12-giải-thích-các-file-quan-trọng)
13. [Luồng Xử Lý Upload Ảnh Lên S3](#13-luồng-xử-lý-upload-ảnh-lên-s3)
14. [Cấu Hình S3 Bucket Cho Phép Xem Ảnh](#14-cấu-hình-s3-bucket-cho-phép-xem-ảnh)
15. [Xử Lý Lỗi](#15-xử-lý-lỗi)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Tổng Quan

Ứng dụng quản lý sản phẩm cho phép:

| Chức năng | Mô tả |
|-----------|-------|
| **Hiển thị** | Liệt kê toàn bộ sản phẩm từ DynamoDB với ảnh, giá, số lượng |
| **Thêm** | Điền form → ảnh upload lên S3 → URL lưu vào DynamoDB |
| **Sửa** | Cập nhật tên/giá/số lượng, tùy chọn thay ảnh mới hoặc giữ ảnh cũ |
| **Xóa** | Xóa sản phẩm (có popup xác nhận) và ảnh trên S3 |
| **Tìm kiếm** | Tìm theo tên, không phân biệt chữ hoa/thường |

---

## 2. Yêu Cầu Cài Đặt Trước

- **Node.js** ≥ 18 và **npm** — [https://nodejs.org](https://nodejs.org)
- **Tài khoản AWS** có quyền truy cập DynamoDB và S3
- **AWS IAM User** có Access Key + Secret Key với các permission:
  - `dynamodb:CreateTable`, `dynamodb:DescribeTable`
  - `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:UpdateItem`, `dynamodb:DeleteItem`, `dynamodb:Scan`
  - `s3:PutObject`, `s3:DeleteObject`, `s3:GetObject`
- **S3 Bucket** đã tạo sẵn (xem Bước 1)

---

## 3. Cấu Trúc Dự Án

```
Lab_6/
├── app.js                         ← Entry point Express
├── package.json
├── .env.example                   ← Mẫu file cấu hình
├── scripts/
│   └── create-table.js            ← Script tạo bảng DynamoDB
└── src/
    ├── config/
    │   ├── dynamodb.js            ← DynamoDB client
    │   └── s3.js                  ← S3 client + multer upload
    ├── models/
    │   └── product.model.js       ← Thao tác dữ liệu DynamoDB (CRUD)
    ├── controllers/
    │   └── product.controller.js  ← Logic nghiệp vụ, xử lý request/response
    ├── routes/
    │   └── product.routes.js      ← Định nghĩa các route
    ├── views/
    │   ├── partials/
    │   │   ├── header.ejs         ← HTML head + navbar
    │   │   └── footer.ejs         ← Footer + Bootstrap JS
    │   ├── index.ejs              ← Danh sách sản phẩm + tìm kiếm
    │   ├── add.ejs                ← Form thêm sản phẩm
    │   ├── edit.ejs               ← Form sửa sản phẩm
    │   ├── error.ejs              ← Trang lỗi server
    │   └── 404.ejs                ← Trang không tìm thấy
    └── public/
        └── css/
            └── style.css          ← CSS tùy chỉnh
```

---

## Bước 1 — Chuẩn Bị AWS

### 1.1 Tạo IAM User

1. Đăng nhập **AWS Console** → **IAM** → **Users** → **Create user**
2. Đặt tên, chọn **Programmatic access**
3. Attach policy: **AmazonDynamoDBFullAccess** và **AmazonS3FullAccess**  
   *(hoặc policy chi tiết hơn theo nguyên tắc least privilege)*
4. Tải file CSV chứa **Access Key ID** và **Secret Access Key** — lưu lại cẩn thận

### 1.2 Tạo S3 Bucket

1. **S3** → **Create bucket**
2. Đặt **Bucket name** (VD: `my-products-bucket-2024`) — **phải unique toàn cầu**
3. Chọn **AWS Region** (VD: `us-east-1`)
4. **Quan trọng:** Ở phần *Block Public Access*, **bỏ chọn** "Block all public access" rồi xác nhận
5. Click **Create bucket**

### 1.3 Cấu hình Bucket Policy (cho phép xem ảnh công khai)

1. Vào bucket → tab **Permissions** → **Bucket policy** → **Edit**
2. Dán policy sau (thay `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. Click **Save changes**

---

## Bước 2 — Clone / Tải Code

Đặt toàn bộ folder `Lab_6` vào máy tính. Folder phải có đầy đủ cấu trúc như mục 3.

---

## Bước 3 — Cài Đặt Dependencies

Mở terminal tại thư mục `Lab_6` và chạy:

```bash
npm install
```

Lệnh này sẽ cài đặt:

| Package | Mục đích |
|---------|----------|
| `express` | Web framework |
| `ejs` | Template engine |
| `dotenv` | Đọc biến môi trường từ `.env` |
| `multer` | Xử lý file upload |
| `@aws-sdk/client-dynamodb` | Kết nối DynamoDB |
| `@aws-sdk/lib-dynamodb` | DocumentClient (tiện dụng hơn) |
| `@aws-sdk/client-s3` | Kết nối S3 |

---

## Bước 4 — Cấu Hình Biến Môi Trường

1. Sao chép file mẫu:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

2. Mở file `.env` và điền thông tin thực:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

S3_BUCKET_NAME=my-products-bucket-2024

DYNAMODB_TABLE=Products

PORT=3000
```

> ⚠️ **Không commit file `.env` lên Git.** Thêm `.env` vào `.gitignore`.

---

## Bước 5 — Tạo Bảng DynamoDB

Chạy lệnh sau để tự động tạo bảng `Products` trên DynamoDB:

```bash
npm run setup
```

Output mong đợi:

```
🔧  Đang tạo bảng "Products"...
⏳  Đang chờ bảng khởi động...
   Trạng thái: CREATING
   Trạng thái: ACTIVE
✅  Bảng "Products" đã sẵn sàng!
   Khóa chính : id (String)
   Thuộc tính : name, image, price (Number), quantity (Number)
```

Nếu bảng đã tồn tại, script sẽ báo và không làm gì thêm.

---

## Bước 6 — Chạy Ứng Dụng

### Chế độ production

```bash
npm start
```

### Chế độ phát triển (tự reload khi sửa code)

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

---

## 10. Chức Năng Ứng Dụng

### 10.1 Danh Sách Sản Phẩm

- URL: `GET /products`
- Hiển thị bảng sản phẩm: STT, Mã SP, Tên, Ảnh thumbnail, Giá (format VNĐ), Số lượng
- Số lượng = 0 → badge đỏ; > 0 → badge xanh

### 10.2 Tìm Kiếm

- Nhập từ khóa vào ô tìm kiếm → nhấn **Tìm**
- Tìm kiếm không phân biệt hoa/thường, tìm theo `contains` trong tên
- URL dạng: `/products?search=từ+khóa`
- Nhấn **Xóa** để quay lại danh sách đầy đủ

### 10.3 Thêm Sản Phẩm

- URL: `GET /products/add`
- Điền các trường bắt buộc: Mã SP, Tên, Hình ảnh, Giá, Số lượng
- Click **Thêm Sản Phẩm** → ảnh upload S3 → lưu DynamoDB → redirect về danh sách
- Form có preview ảnh ngay khi chọn file
- Validation phía client và phía server

### 10.4 Sửa Sản Phẩm

- URL: `GET /products/edit/:id`
- Mã sản phẩm **không thể thay đổi** (read-only)
- Để trống ô *Thay Hình Ảnh Mới* → giữ nguyên ảnh cũ
- Chọn file mới → upload S3, xóa ảnh cũ, cập nhật URL trong DynamoDB

### 10.5 Xóa Sản Phẩm

- Click icon thùng rác → popup Bootstrap xác nhận
- Nhấn **Xóa** → xóa ảnh trên S3 + xóa record DynamoDB → redirect về danh sách

---

## 11. Giải Thích Kiến Trúc MVC

```
Browser  ──→  Routes  ──→  Controller  ──→  Model  ──→  DynamoDB
                                 │
                                 └──→  S3 (upload/delete ảnh)
                                 │
                     Views (EJS) ←──  Controller (render)
```

| Tầng | File | Trách nhiệm |
|------|------|-------------|
| **Model** | `src/models/product.model.js` | Giao tiếp trực tiếp với DynamoDB (CRUD thuần) |
| **View** | `src/views/*.ejs` | Render HTML, không chứa logic nghiệp vụ |
| **Controller** | `src/controllers/product.controller.js` | Nhận request, validate, gọi Model/S3, trả View |
| **Routes** | `src/routes/product.routes.js` | Map URL → Controller method |
| **Config** | `src/config/` | Khởi tạo AWS clients, multer |

---

## 12. Giải Thích Các File Quan Trọng

### `src/config/dynamodb.js`

```javascript
const client = new DynamoDBClient({ region, credentials });
const docClient = DynamoDBDocumentClient.from(client);
```

`DynamoDBDocumentClient` tự động marshal/unmarshal kiểu dữ liệu JavaScript ↔ DynamoDB, 
nên ta có thể dùng object JS bình thường thay vì `{ S: 'text' }`, `{ N: '42' }`.

### `src/config/s3.js`

- `upload` — instance multer dùng `memoryStorage()` (giữ file trong RAM buffer)
- `uploadToS3(file)` — gọi `PutObjectCommand`, trả về URL public
- `deleteFromS3(url)` — parse key từ URL, gọi `DeleteObjectCommand`, lỗi **không fatal**

### `src/models/product.model.js`

| Method | DynamoDB Command | Ghi chú |
|--------|-----------------|---------|
| `getAll()` | `ScanCommand` | Trả tất cả items |
| `getById(id)` | `GetCommand` | Trả 1 item theo khóa |
| `searchByName(kw)` | `ScanCommand` + JS filter | Case-insensitive |
| `create(data)` | `PutCommand` + `attribute_not_exists(id)` | Bảo đảm ID unique |
| `update(id, data)` | `UpdateCommand` + `attribute_exists(id)` | Chỉ cập nhật field được truyền |
| `delete(id)` | `DeleteCommand` + `attribute_exists(id)` | Lỗi nếu không tồn tại |

### `src/controllers/product.controller.js`

- Static class với các method: `index`, `showAddForm`, `create`, `showEditForm`, `update`, `delete`
- Validation được tập trung tại `_validate()` (tên, giá, số lượng)
- Lỗi → redirect về form kèm query param `?error=MESSAGE` hoặc render trang error

### `src/routes/product.routes.js`

```
GET  /products          →  ProductController.index
GET  /products/add      →  ProductController.showAddForm
POST /products/add      →  handleUpload → ProductController.create
GET  /products/edit/:id →  ProductController.showEditForm
POST /products/edit/:id →  handleUpload → ProductController.update
POST /products/delete/:id → ProductController.delete
```

`handleUpload` là middleware bọc multer — nếu multer báo lỗi, đặt `req.uploadError` thay vì throw.

---

## 13. Luồng Xử Lý Upload Ảnh Lên S3

```
User chọn file  →  Browser gửi multipart/form-data
               →  Express nhận request
               →  multer (memoryStorage) đọc file vào req.file.buffer
               →  Controller gọi uploadToS3(req.file)
               →  S3Client.send(PutObjectCommand)  →  S3 bucket
               →  Trả về URL: https://bucket.s3.region.amazonaws.com/products/123-abc.jpg
               →  Lưu URL vào DynamoDB field "image"
```

**Khi sửa sản phẩm (chọn ảnh mới):**

```
Upload ảnh mới lên S3  →  Nhận URL mới
                       →  Xóa ảnh cũ khỏi S3 (deleteFromS3)
                       →  Cập nhật DynamoDB với URL mới
```

---

## 14. Cấu Hình S3 Bucket Cho Phép Xem Ảnh

Ảnh upload lên S3 mặc định là **private**. Để hiển thị ảnh trên web cần một trong hai cách:

### Cách 1: Bucket Policy Public (đơn giản, dùng cho học tập)

Xem lại [Bước 1.3](#13-cấu-hình-bucket-policy-cho-phép-xem-ảnh-công-khai).

### Cách 2: Pre-signed URL (bảo mật hơn, cho production)

Thay `uploadToS3` để không trả URL public mà trả S3 key, sau đó dùng `GetObjectCommand` + 
`getSignedUrl` để tạo URL tạm thời khi render view.  
*(Không cần trong bài này — chỉ dùng cho hệ thống thực tế)*

---

## 15. Xử Lý Lỗi

| Tình huống | Xử lý |
|-----------|-------|
| ID trùng khi thêm | Redirect về `/products/add?error=...` |
| File ảnh sai định dạng | `req.uploadError` → redirect về form |
| File ảnh > 5MB | Multer `LIMIT_FILE_SIZE` → redirect |
| Upload S3 thất bại | Redirect về form, **không** lưu DynamoDB |
| Sản phẩm không tìm thấy | Render `404.ejs` |
| Lỗi server khác | Render `error.ejs` |

---

## 16. Troubleshooting

### `CredentialsProviderError` hoặc `InvalidSignatureException`

- Kiểm tra `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY` trong `.env`
- Kiểm tra `AWS_REGION` khớp với region của DynamoDB/S3

### `ResourceNotFoundException: Requested resource not found`

- Bảng DynamoDB chưa được tạo. Chạy lại: `npm run setup`

### Ảnh không hiển thị (ô ảnh trống hoặc broken icon)

- S3 bucket chưa cấu hình public access / bucket policy
- Kiểm tra `S3_BUCKET_NAME` trong `.env` có chính xác không

### `NoSuchBucket`

- Tên bucket trong `.env` không khớp với bucket thực tế trên AWS

### Port 3000 đã bị chiếm

- Thay `PORT=3001` (hoặc bất kỳ port trống nào) trong `.env`

### Lỗi `Cannot find module`

- Chạy lại `npm install` trong thư mục `Lab_6`

---

*Được tạo cho Lab 6 — Node.js + DynamoDB + S3*
