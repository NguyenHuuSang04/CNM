# TÀI LIỆU KỸ THUẬT

## 1.4.1 Kiến trúc hệ thống

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │ HTTP
┌──────▼──────────────────────────────┐
│     Node.js + Express Server        │
│  ┌──────────────────────────────┐   │
│  │  MVC Architecture            │   │
│  │  ├─ Routes (product.routes)  │   │
│  │  ├─ Controllers              │   │
│  │  ├─ Models (product.model)   │   │
│  │  └─ Views (EJS templates)    │   │
│  └──────────────────────────────┘   │
└────┬──────────────────────┬─────────┘
     │                      │
     │ AWS SDK v3           │ AWS SDK v3
     │                      │
┌────▼──────┐         ┌─────▼─────┐
│ DynamoDB  │         │    S3     │
│ (Database)│         │ (Storage) │
└───────────┘         └───────────┘
```

**Công nghệ sử dụng:**
- **Backend**: Node.js, Express.js
- **View Engine**: EJS
- **Database**: AWS DynamoDB (NoSQL)
- **Storage**: AWS S3 (Object Storage)
- **File Upload**: Multer (memory storage)
- **Pattern**: MVC (Model-View-Controller)

## 1.4.2 Cách kết nối DynamoDB

**File:** `src/config/dynamodb.js`

```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Khởi tạo client với credentials
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Document client để làm việc với JSON
const docClient = DynamoDBDocumentClient.from(client);
```

**Sử dụng trong Model:**

```javascript
const { docClient } = require('../config/dynamodb');
const { ScanCommand, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Lấy tất cả sản phẩm
await docClient.send(new ScanCommand({ TableName: 'Products' }));

// Lấy theo ID
await docClient.send(new GetCommand({ TableName: 'Products', Key: { id } }));

// Thêm/cập nhật
await docClient.send(new PutCommand({ TableName: 'Products', Item: product }));
```

**Commands chính:**
- `ScanCommand` - Lấy tất cả items
- `GetCommand` - Lấy item theo key
- `PutCommand` - Thêm/cập nhật item
- `UpdateCommand` - Cập nhật một phần item
- `DeleteCommand` - Xóa item

## 1.4.3 Cách upload ảnh lên S3

**File:** `src/config/s3.js`

**Bước 1: Cấu hình Multer (nhận file từ client)**

```javascript
const upload = multer({
    storage: multer.memoryStorage(), // Lưu vào RAM
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        if (allowed.test(file.mimetype)) return cb(null, true);
        cb(null, false);
    },
});
```

**Bước 2: Upload lên S3**

```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

async function uploadToS3(file) {
    const key = `products/${Date.now()}-${file.originalname}`;
    
    await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }));
    
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
```

**Bước 3: Sử dụng trong Route**

```javascript
router.post('/add', upload.single('image'), async (req, res) => {
    if (req.file) {
        const imageUrl = await uploadToS3(req.file);
        // Lưu imageUrl vào DynamoDB
    }
});
```

**Quy trình:**
1. Client upload file qua form multipart
2. Multer nhận file vào memory (buffer)
3. Validate định dạng và kích thước
4. Upload buffer lên S3 với PutObjectCommand
5. Nhận URL công khai từ S3
6. Lưu URL vào DynamoDB

## 1.4.4 Phân công công việc (Nhóm)

### **Thành viên 1: Backend Core**
- Setup project, cấu hình .env
- Kết nối AWS (DynamoDB + S3)
- Implement Models (product.model.js)
- Viết script tạo bảng (create-table.js)

### **Thành viên 2: Controllers & Routes**
- Implement Controllers (product.controller.js)
- Xử lý CRUD operations
- Xử lý upload/delete ảnh S3
- Error handling và validation

### **Thành viên 3: Views & Frontend**
- Thiết kế giao diện EJS (index, add, edit)
- Viết CSS (style.css)
- Tích hợp views với controllers
- Xử lý form submission

### **Thành viên 4: Testing & Documentation**
- Test các chức năng CRUD
- Viết tài liệu hướng dẫn
- Setup AWS (tạo bucket S3, IAM user)
- Deploy và troubleshooting

### **Timeline gợi ý:**
1. **Tuần 1**: Setup + AWS Config + Models
2. **Tuần 2**: Controllers + Routes + Basic Views
3. **Tuần 3**: Views hoàn thiện + CSS + Integration
4. **Tuần 4**: Testing + Documentation + Deploy

### **Công cụ hỗ trợ làm việc nhóm:**
- **Git/GitHub**: Quản lý code, làm việc theo branch
- **Trello/Notion**: Quản lý task
- **Discord/Slack**: Giao tiếp nhóm
