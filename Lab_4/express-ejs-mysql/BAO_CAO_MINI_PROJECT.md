# Tài liệu Báo cáo Mini Project

**Đề tài:** Xây dựng ứng dụng web quản lý sản phẩm sử dụng Node.js – Express – EJS – DynamoDB triển khai trên Amazon Web Services (AWS)

---

## 1. Giới thiệu đề tài

### 1.1. Bối cảnh và mục đích

Trong bối cảnh điện toán đám mây (Cloud Computing) đang phát triển mạnh mẽ, việc xây dựng ứng dụng web trên nền tảng AWS trở thành kỹ năng quan trọng cho các lập trình viên. Đề tài này tập trung vào việc:

- Xây dựng ứng dụng CRUD (Create, Read, Update, Delete) hoàn chỉnh
- Sử dụng cơ sở dữ liệu NoSQL DynamoDB của AWS
- Lưu trữ tệp tin (hình ảnh) trên Amazon S3
- Triển khai ứng dụng trên Amazon EC2
- Áp dụng mô hình kiến trúc MVC (Model-View-Controller)

### 1.2. Mục tiêu

**Mục tiêu chính:**
- Xây dựng ứng dụng web quản lý sản phẩm hoàn chỉnh
- Tích hợp các dịch vụ AWS: EC2, DynamoDB, S3, IAM
- Hiểu và áp dụng kiến trúc ứng dụng trên Cloud

**Mục tiêu phụ:**
- Nắm vững cách làm việc với DynamoDB (NoSQL database)
- Hiểu cách upload và quản lý file trên S3
- Biết cách deploy ứng dụng Node.js lên EC2
- Áp dụng best practices về bảo mật AWS

### 1.3. Phạm vi đề tài

**Trong phạm vi:**
- ✅ Quản lý sản phẩm (thêm, xem, sửa, xóa)
- ✅ Upload và lưu trữ hình ảnh sản phẩm
- ✅ Giao diện web responsive
- ✅ Triển khai trên AWS

**Ngoài phạm vi:**
- ❌ Quản lý người dùng và phân quyền chi tiết
- ❌ Giỏ hàng và thanh toán
- ❌ API RESTful cho mobile app
- ❌ Tìm kiếm và lọc nâng cao

---

## 2. Kiến trúc hệ thống

### 2.1. Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────┐
│                    End User (Browser)                    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS/HTTP Request
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Amazon EC2 Instance                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Node.js Application Server                │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  Express.js Framework                       │  │  │
│  │  │  ├─ Controllers (Business Logic)            │  │  │
│  │  │  ├─ Models (Data Access Layer)              │  │  │
│  │  │  ├─ Views (EJS Templates)                   │  │  │
│  │  │  └─ Routes (URL Mapping)                    │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                     │  │
│  │  AWS SDK v3                                        │  │
│  │  ├─ DynamoDB Client                                │  │
│  │  └─ S3 Client                                      │  │
│  └───────────────┬───────────────┬────────────────────┘  │
└──────────────────┼───────────────┼───────────────────────┘
                   │               │
        ┌──────────▼──────┐   ┌────▼─────────────┐
        │                 │   │                   │
   ┌────▼──────────────┐  │   │  ┌─────────────┐ │
   │  Amazon DynamoDB  │  │   │  │  Amazon S3  │ │
   │                   │  │   │  │   Bucket    │ │
   │  Table: Products  │  │   │  │             │ │
   │  ├─ id (PK)       │  │   │  │  products/  │ │
   │  ├─ name          │  │   │  │  ├─ img1.jpg│ │
   │  ├─ price         │  │   │  │  ├─ img2.png│ │
   │  ├─ quantity      │  │   │  │  └─ ...     │ │
   │  ├─ url_image     │  │   │  └─────────────┘ │
   │  └─ createdAt     │  │   │                   │
   └───────────────────┘  │   └───────────────────┘
                          │
                   ┌──────▼────────┐
                   │   IAM Role    │
                   │  Permissions  │
                   │  ├─ DynamoDB  │
                   │  └─ S3        │
                   └───────────────┘
```

### 2.2. Luồng hoạt động (Flow)

#### **Luồng xem danh sách sản phẩm:**
1. User truy cập `http://<EC2-IP>:3000/`
2. Express Router nhận request → gọi `ProductController.index()`
3. Controller gọi `ProductModel.getAll()`
4. Model thực hiện DynamoDB Scan operation
5. DynamoDB trả về danh sách items
6. Controller render view `products.ejs` với dữ liệu
7. EJS template hiển thị HTML kèm hình ảnh từ S3
8. Response trả về browser

#### **Luồng thêm sản phẩm mới:**
1. User điền form tại `/add` và submit
2. Multer-S3 middleware xử lý file upload
3. File được upload lên S3, trả về URL
4. Request đến `ProductController.create()`
5. Controller gọi `ProductModel.create()` với dữ liệu + S3 URL
6. Model tạo UUID và thực hiện DynamoDB PutItem
7. Redirect về trang danh sách

#### **Luồng cập nhật sản phẩm:**
1. User chỉnh sửa tại `/edit/:id` và submit
2. Nếu có file mới: upload lên S3, xóa file cũ
3. Controller gọi `ProductModel.update()`
4. Model thực hiện DynamoDB UpdateItem
5. Redirect về trang danh sách

#### **Luồng xóa sản phẩm:**
1. User click nút Xóa và confirm
2. POST request đến `/delete/:id`
3. Controller gọi `ProductModel.delete()`
4. Model:
   - Lấy thông tin sản phẩm (để có URL ảnh)
   - Thực hiện DynamoDB DeleteItem
   - Xóa file trên S3
5. Redirect về trang danh sách

---

## 3. Thiết kế cơ sở dữ liệu DynamoDB

### 3.1. Đặc điểm DynamoDB (NoSQL)

**So sánh với MySQL:**

| Đặc điểm | MySQL (SQL) | DynamoDB (NoSQL) |
|----------|-------------|------------------|
| **Schema** | Cố định, phải define trước | Flexible, schema-less |
| **Kiểu dữ liệu** | Table với rows/columns | Key-Value, Document |
| **Primary Key** | AUTO_INCREMENT | UUID (String) |
| **Query** | SQL (JOIN, WHERE, ...) | Partition Key, Scan |
| **Scaling** | Vertical (nâng cấp server) | Horizontal (auto-scaling) |
| **Chi phí** | Theo instance size | Theo read/write capacity |

**Ưu điểm DynamoDB:**
- ✅ Tự động scale theo traffic
- ✅ Hiệu suất cao và ổn định
- ✅ Fully managed (không cần quản lý server)
- ✅ Pay-per-use (chỉ trả tiền khi dùng)

**Nhược điểm:**
- ❌ Không hỗ trợ JOIN
- ❌ Query phức tạp khó khăn hơn SQL
- ❌ Cần thiết kế Key Schema cẩn thận

### 3.2. Thiết kế bảng Products

#### Cấu trúc bảng:

| Thuộc tính | Kiểu | Mô tả | Ví dụ |
|------------|------|-------|-------|
| **id** | String (PK) | UUID - Partition Key | `550e8400-e29b-41d4-a716-446655440000` |
| name | String | Tên sản phẩm | `iPhone 15 Pro Max` |
| price | Number | Giá sản phẩm (VNĐ) | `29990000` |
| quantity | Number | Số lượng tồn kho | `50` |
| url_image | String | URL hình ảnh trên S3 | `https://bucket.s3.region.amazonaws.com/products/img.jpg` |
| createdAt | String | Timestamp tạo | `2026-01-26T10:30:00.000Z` |

#### Ví dụ Item trong DynamoDB:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "iPhone 15 Pro Max 256GB",
  "price": 29990000,
  "quantity": 50,
  "url_image": "https://product-app-images.s3.ap-southeast-1.amazonaws.com/products/1706260800000-iphone15.jpg",
  "createdAt": "2026-01-26T10:30:00.000Z"
}
```

#### Thiết kế Key Schema:

- **Partition Key:** `id` (String)
- **Sort Key:** Không sử dụng (vì đây là bảng đơn giản)
- **UUID:** Sử dụng thư viện `uuid` để tạo ID unique

**Tại sao dùng UUID thay vì AUTO_INCREMENT?**
- DynamoDB không hỗ trợ AUTO_INCREMENT
- UUID đảm bảo uniqueness trong môi trường phân tán
- Tránh conflict khi có nhiều server ghi đồng thời

### 3.3. DynamoDB Operations sử dụng

| Operation | SDK Method | Mục đích |
|-----------|------------|----------|
| **Create** | `PutItem` | Thêm sản phẩm mới |
| **Read All** | `Scan` | Lấy toàn bộ sản phẩm |
| **Read One** | `GetItem` | Lấy 1 sản phẩm theo ID |
| **Update** | `UpdateItem` | Cập nhật thông tin |
| **Delete** | `DeleteItem` | Xóa sản phẩm |

**Code ví dụ (PutItem):**
```javascript
const params = {
  TableName: 'Products',
  Item: {
    id: uuidv4(),
    name: 'iPhone 15 Pro',
    price: 29990000,
    quantity: 50,
    url_image: 's3-url',
    createdAt: new Date().toISOString()
  }
};
await dynamoDb.send(new PutCommand(params));
```

---

## 4. Mô tả các chức năng CRUD

### 4.1. Create - Thêm sản phẩm

**Giao diện:**
- Form nhập: tên, giá, số lượng
- Input file để upload hình ảnh
- Nút "Lưu sản phẩm"

**Quy trình xử lý:**
1. User điền form và chọn ảnh → Submit
2. **Backend (Express):**
   - Multer-S3 middleware xử lý file upload
   - Validate dữ liệu (name, price, quantity không rỗng)
   - Upload ảnh lên S3 bucket (folder `products/`)
   - S3 trả về URL public
3. **Model:**
   - Tạo UUID cho sản phẩm
   - Gọi DynamoDB `PutItem` với dữ liệu
4. **Response:** Redirect về trang danh sách

**Validation:**
- ✅ Tên sản phẩm: Bắt buộc
- ✅ Giá: Số dương
- ✅ Số lượng: Số nguyên ≥ 0
- ✅ Hình ảnh: Tối đa 5MB, định dạng JPG/PNG/GIF

**Code sample:**
```javascript
// Controller
static async create(req, res) {
  const { name, price, quantity } = req.body;
  const url_image = req.file ? req.file.location : '';
  
  await ProductModel.create({ name, price, quantity, url_image });
  res.redirect('/');
}

// Model
static async create(productData) {
  const id = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id,
      name: productData.name,
      price: Number(productData.price),
      quantity: Number(productData.quantity),
      url_image: productData.url_image || '',
      createdAt: new Date().toISOString()
    }
  };
  await dynamoDb.send(new PutCommand(params));
  return id;
}
```

### 4.2. Read - Xem danh sách sản phẩm

**Giao diện:**
- Bảng hiển thị: Hình ảnh | Tên | Giá | Số lượng | Hành động
- Nút "Thêm sản phẩm mới"

**Quy trình xử lý:**
1. User truy cập `/`
2. Controller gọi `ProductModel.getAll()`
3. Model thực hiện DynamoDB `Scan` (lấy toàn bộ items)
4. Controller render EJS template với data
5. Template hiển thị bảng, hình ảnh load từ S3

**Đặc điểm Scan:**
- ⚠️ Scan toàn bộ table (không hiệu quả với table lớn)
- Có thể dùng Query + GSI (Global Secondary Index) để optimize
- Đối với bài tập nhỏ, Scan là đủ

**Code sample:**
```javascript
// Model
static async getAll() {
  const params = {
    TableName: TABLE_NAME
  };
  const data = await dynamoDb.send(new ScanCommand(params));
  return data.Items || [];
}

// View (EJS)
<% products.forEach(product => { %>
  <tr>
    <td><img src="<%= product.url_image %>" alt="<%= product.name %>"></td>
    <td><%= product.name %></td>
    <td><%= Number(product.price).toLocaleString('vi-VN') %> VNĐ</td>
    <td><%= product.quantity %></td>
    <td>
      <a href="/edit/<%= product.id %>">Sửa</a>
      <form action="/delete/<%= product.id %>" method="POST">
        <button>Xóa</button>
      </form>
    </td>
  </tr>
<% }) %>
```

### 4.3. Update - Cập nhật sản phẩm

**Giao diện:**
- Form giống Create, nhưng đã điền sẵn dữ liệu hiện tại
- Hiển thị ảnh hiện tại
- Cho phép thay đổi ảnh (optional)

**Quy trình xử lý:**
1. User click "Sửa" → GET `/edit/:id`
2. Controller lấy sản phẩm theo ID, render form
3. User chỉnh sửa và submit → POST `/edit/:id`
4. Nếu có upload ảnh mới:
   - Upload lên S3
   - Xóa ảnh cũ trên S3
5. Model thực hiện DynamoDB `UpdateItem`
6. Redirect về danh sách

**UpdateItem vs PutItem:**
- `PutItem`: Ghi đè toàn bộ item
- `UpdateItem`: Chỉ cập nhật các thuộc tính cụ thể

**Code sample:**
```javascript
// Model
static async update(id, productData) {
  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set #name = :name, price = :price, quantity = :quantity, url_image = :url_image',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': productData.name,
      ':price': Number(productData.price),
      ':quantity': Number(productData.quantity),
      ':url_image': productData.url_image || ''
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const data = await dynamoDb.send(new UpdateCommand(params));
  return data.Attributes ? true : false;
}
```

### 4.4. Delete - Xóa sản phẩm

**Giao diện:**
- Nút "Xóa" trong bảng danh sách
- Confirm dialog: "Bạn có chắc muốn xóa?"

**Quy trình xử lý:**
1. User click "Xóa" → hiện confirm
2. Confirm → POST `/delete/:id`
3. Model:
   - Lấy thông tin sản phẩm (để có `url_image`)
   - Thực hiện DynamoDB `DeleteItem`
   - Xóa file ảnh trên S3 (nếu có)
4. Redirect về danh sách

**Xóa file trên S3:**
```javascript
// Trích xuất Key từ URL
// URL: https://bucket.s3.region.amazonaws.com/products/file.jpg
// Key: products/file.jpg

static async deleteImageFromS3(imageUrl) {
  const urlParts = imageUrl.split('/');
  const key = urlParts.slice(-2).join('/'); // "products/filename.jpg"
  
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  };
  
  await s3Client.send(new DeleteObjectCommand(params));
}
```

**Code sample:**
```javascript
// Model
static async delete(id) {
  // Lấy thông tin sản phẩm trước
  const product = await this.getById(id);
  
  // Xóa trong DynamoDB
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };
  await dynamoDb.send(new DeleteCommand(params));
  
  // Xóa ảnh trên S3
  if (product && product.url_image) {
    await this.deleteImageFromS3(product.url_image);
  }
  
  return true;
}
```

---

## 5. Hình ảnh minh họa giao diện

### 5.1. Trang danh sách sản phẩm

```
┌─────────────────────────────────────────────────────────┐
│  📦 Quản lý Sản phẩm                                    │
│  Sử dụng DynamoDB + S3 + EC2                            │
│                                                          │
│  [➕ Thêm sản phẩm mới]                                 │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Hình ảnh │ Tên sản phẩm        │ Giá      │ SL │ ⚙️│ │
│  ├────────────────────────────────────────────────────┤ │
│  │ [IMG]    │ iPhone 15 Pro Max   │ 29,990k  │ 50 │🔧│ │
│  │ [IMG]    │ Samsung S24 Ultra   │ 25,990k  │ 30 │🔧│ │
│  │ [IMG]    │ MacBook Pro M3      │ 45,000k  │ 10 │🔧│ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Mô tả:**
- Header: Tiêu đề + subtitle
- Button "Thêm sản phẩm mới" nổi bật
- Bảng responsive với hình ảnh thumbnail
- Cột "Hành động" có nút Sửa và Xóa
- Format giá theo định dạng Việt Nam

### 5.2. Trang thêm/sửa sản phẩm

```
┌─────────────────────────────────────────────────────────┐
│  ➕ Thêm sản phẩm mới                                   │
│                                                          │
│  Tên sản phẩm: [_____________________________]          │
│                                                          │
│  Giá (VNĐ):    [_____________________________]          │
│                                                          │
│  Số lượng:     [_____________________________]          │
│                                                          │
│  Hình ảnh:     [Choose File] No file chosen             │
│                (Chấp nhận: JPG, PNG, GIF - Max 5MB)     │
│                                                          │
│  [💾 Lưu sản phẩm]  [❌ Hủy]                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Mô tả:**
- Form đơn giản, dễ sử dụng
- Input type="number" cho giá và số lượng
- Input type="file" với accept="image/*"
- Hai nút hành động rõ ràng

### 5.3. Responsive Design

**Desktop (> 768px):**
- Bảng full width với 5 cột
- Hình ảnh 100x100px

**Mobile (< 768px):**
- Bảng chuyển thành card layout
- Hình ảnh 80x80px
- Button stack vertically

---

## 6. Kết luận

### 6.1. Kết quả đạt được

✅ **Hoàn thành các mục tiêu:**
1. Xây dựng ứng dụng CRUD hoàn chỉnh
2. Tích hợp thành công DynamoDB và S3
3. Deploy thành công lên EC2
4. Giao diện thân thiện, responsive
5. Code tuân thủ mô hình MVC
6. Áp dụng best practices về bảo mật AWS

✅ **Kiến thức đạt được:**
- Hiểu rõ cách làm việc với DynamoDB (NoSQL)
- Thành thạo upload file lên S3
- Biết cách deploy Node.js app lên EC2
- Nắm vững AWS SDK v3
- Hiểu về IAM Role và Security Groups

✅ **Tính năng đã implement:**
- Create: Thêm sản phẩm + upload ảnh
- Read: Xem danh sách với hình ảnh
- Update: Sửa thông tin + đổi ảnh
- Delete: Xóa sản phẩm + xóa ảnh

### 6.2. Hạn chế và hướng phát triển

**Hạn chế hiện tại:**
- ⚠️ Chưa có authentication (đăng nhập)
- ⚠️ Chưa có phân quyền (admin/user)
- ⚠️ Chưa có pagination cho danh sách lớn
- ⚠️ Chưa có search/filter
- ⚠️ Scan toàn bộ table (không hiệu quả với data lớn)

**Hướng phát triển:**
1. **Authentication & Authorization:**
   - Thêm login/register với Amazon Cognito
   - Phân quyền: Admin (full CRUD), User (chỉ xem)

2. **Pagination & Search:**
   - Implement DynamoDB pagination với `LastEvaluatedKey`
   - Thêm GSI (Global Secondary Index) cho search theo tên
   - Filter theo khoảng giá, số lượng

3. **Performance Optimization:**
   - Sử dụng DynamoDB Query thay vì Scan
   - Thêm CloudFront CDN cho S3 images
   - Implement caching với Redis (ElastiCache)

4. **Monitoring & Logging:**
   - Tích hợp CloudWatch Logs
   - Set up alarms cho errors
   - Dashboard theo dõi metrics

5. **CI/CD Pipeline:**
   - GitHub Actions để auto-deploy
   - Testing tự động
   - Blue-green deployment

6. **Mở rộng chức năng:**
   - Quản lý categories (danh mục)
   - Import/export CSV
   - Lịch sử thay đổi (audit log)
   - API RESTful cho mobile app

### 6.3. Bài học kinh nghiệm

**Technical:**
- DynamoDB cần thiết kế Key Schema cẩn thận từ đầu
- S3 cần cấu hình CORS và Bucket Policy đúng
- IAM Role an toàn hơn Access Keys cho EC2
- PM2 giúp app chạy ổn định trên production

**Soft skills:**
- Đọc documentation AWS rất quan trọng
- Testing kỹ trước khi deploy
- Backup data thường xuyên
- Theo dõi chi phí AWS

### 6.4. Tổng kết

Dự án đã hoàn thành đầy đủ các yêu cầu của đề tài:
- ✅ CRUD application hoạt động tốt
- ✅ DynamoDB lưu trữ dữ liệu hiệu quả
- ✅ S3 quản lý hình ảnh tốt
- ✅ EC2 chạy app ổn định
- ✅ Code sạch, có cấu trúc MVC

Đây là nền tảng tốt để phát triển thành ứng dụng thương mại điện tử hoàn chỉnh.

---

## Phụ lục

### A. Cấu trúc thư mục project

```
express-ejs-dynamodb/
├── models/
│   ├── product.model.js      # CRUD operations với DynamoDB
│   └── user.model.js
├── views/
│   ├── products.ejs          # Danh sách sản phẩm
│   ├── add-product.ejs       # Form thêm
│   └── edit-product.ejs      # Form sửa
├── controllers/
│   └── product.controller.js # Business logic
├── routes/
│   └── product.routes.js     # Route definitions
├── config/
│   ├── dynamodb.js          # DynamoDB client
│   └── s3.js                # S3 client + multer
├── scripts/
│   ├── create-dynamodb-table.js
│   └── create-s3-bucket.js
├── public/css/
│   └── style.css
├── app.js                   # Entry point
├── package.json
├── .env.example
├── README.md
└── AWS_SETUP_GUIDE.md
```

### B. Dependencies chính

```json
{
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.975.0",
    "@aws-sdk/client-s3": "^3.975.0",
    "@aws-sdk/lib-dynamodb": "^3.975.0",
    "express": "^5.2.1",
    "ejs": "^4.0.1",
    "multer": "^2.0.2",
    "multer-s3": "^3.0.1",
    "uuid": "^13.0.0",
    "dotenv": "^17.2.3"
  }
}
```

### C. Checklist hoàn thành

- [x] Thiết kế kiến trúc hệ thống
- [x] Thiết kế cơ sở dữ liệu DynamoDB
- [x] Implement CRUD operations
- [x] Tích hợp S3 cho upload ảnh
- [x] Xây dựng giao diện EJS
- [x] Deploy lên EC2
- [x] Cấu hình IAM Security
- [x] Testing các chức năng
- [x] Viết documentation
- [x] Viết báo cáo

---

**Sinh viên thực hiện:** [Tên sinh viên]  
**MSSV:** [Mã số sinh viên]  
**Lớp:** [Tên lớp]  
**Ngày hoàn thành:** [Ngày/Tháng/Năm]
