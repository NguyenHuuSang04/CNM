# Node.js CRUD Application with DynamoDB and Docker

Ứng dụng CRUD (Create, Read, Update, Delete) sử dụng Node.js, Express, DynamoDB và Docker với kiến trúc MVC.

## Cấu trúc dự án

```
nodejs-dynamodb-docker/
├── config/
│   └── database.js          # Cấu hình kết nối DynamoDB
├── controllers/
│   └── productController.js # Controller xử lý logic nghiệp vụ
├── models/
│   └── Product.js           # Model định nghĩa schema và operations
├── routes/
│   └── productRoutes.js     # Định nghĩa các API endpoints
├── scripts/
│   └── initDatabase.js      # Script khởi tạo bảng DynamoDB
├── .env                     # Biến môi trường (credentials)
├── .env.example             # Ví dụ file môi trường
├── .gitignore
├── docker-compose.yml       # Cấu hình Docker Compose
├── Dockerfile               # Docker image definition
├── package.json
└── server.js                # Entry point của ứng dụng
```

## Công nghệ sử dụng

- **Node.js** v18
- **Express.js** - Web framework
- **AWS SDK** - Kết nối DynamoDB
- **DynamoDB Local** - Database local trong Docker
- **Docker & Docker Compose** - Containerization

## Bảng Products

Schema:
- `id` (String, Primary Key) - UUID tự động sinh
- `name` (String) - Tên sản phẩm
- `price` (Number) - Giá sản phẩm
- `url_image` (String) - URL hình ảnh sản phẩm
- `createdAt` (String) - Thời gian tạo
- `updatedAt` (String) - Thời gian cập nhật

## Cài đặt và chạy

### 1. Clone project và cài đặt dependencies

```bash
cd nodejs-dynamodb-docker
npm install
```

### 2. Cấu hình environment variables

File `.env` đã được tạo sẵn với các thông tin:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
DYNAMODB_ENDPOINT=http://dynamodb-local:8000
PORT=3000
DYNAMODB_TABLE_NAME=Products
```

### 3. Chạy với Docker Compose

```bash
# Khởi động containers
docker-compose up -d

# Xem logs
docker-compose logs -f

# Khởi tạo bảng DynamoDB
docker-compose exec app npm run init-db
```

### 4. Chạy không dùng Docker (Development)

```bash
# Cài đặt DynamoDB Local riêng hoặc cập nhật DYNAMODB_ENDPOINT trong .env

# Khởi tạo database
npm run init-db

# Chạy server
npm start

# Hoặc chạy với nodemon (auto-reload)
npm run dev
```

## API Endpoints

Base URL: `http://localhost:3000`

### 1. Lấy tất cả sản phẩm
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "uuid-1",
      "name": "Product 1",
      "price": 100,
      "url_image": "http://example.com/image1.jpg",
      "createdAt": "2026-02-08T10:00:00.000Z",
      "updatedAt": "2026-02-08T10:00:00.000Z"
    }
  ]
}
```

### 2. Lấy sản phẩm theo ID
```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "name": "Product 1",
    "price": 100,
    "url_image": "http://example.com/image1.jpg"
  }
}
```

### 3. Tạo sản phẩm mới
```http
POST /api/products
Content-Type: application/json

{
  "name": "New Product",
  "price": 200,
  "url_image": "http://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "name": "New Product",
    "price": 200,
    "url_image": "http://example.com/image.jpg",
    "createdAt": "2026-02-08T10:00:00.000Z",
    "updatedAt": "2026-02-08T10:00:00.000Z"
  }
}
```

### 4. Cập nhật sản phẩm
```http
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 250,
  "url_image": "http://example.com/new-image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Product",
    "price": 250,
    "url_image": "http://example.com/new-image.jpg",
    "updatedAt": "2026-02-08T11:00:00.000Z"
  }
}
```

### 5. Xóa sản phẩm
```http
DELETE /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Test API với curl

```bash
# Tạo sản phẩm
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":1200,"url_image":"http://example.com/laptop.jpg"}'

# Lấy tất cả sản phẩm
curl http://localhost:3000/api/products

# Lấy sản phẩm theo ID
curl http://localhost:3000/api/products/{id}

# Cập nhật sản phẩm
curl -X PUT http://localhost:3000/api/products/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Laptop","price":1500,"url_image":"http://example.com/gaming-laptop.jpg"}'

# Xóa sản phẩm
curl -X DELETE http://localhost:3000/api/products/{id}
```

## Dừng và xóa containers

```bash
# Dừng containers
docker-compose stop

# Dừng và xóa containers
docker-compose down

# Xóa cả volumes (data sẽ bị mất)
docker-compose down -v
```

## Kiến trúc MVC

- **Model** (`models/Product.js`): Xử lý logic truy cập database
- **View**: API trả về JSON (không có view template)
- **Controller** (`controllers/productController.js`): Xử lý request/response và business logic
- **Routes** (`routes/productRoutes.js`): Định nghĩa các endpoints

## Lưu ý

- DynamoDB Local lưu data trong Docker volume, data sẽ được giữ lại khi restart container
- Credential trong `.env` chỉ dùng cho DynamoDB Local (không cần credential thật)
- Port 3000: Node.js API
- Port 8000: DynamoDB Local Admin

## Troubleshooting

### Lỗi kết nối DynamoDB
Kiểm tra container đang chạy:
```bash
docker-compose ps
```

### Xem logs
```bash
docker-compose logs app
docker-compose logs dynamodb-local
```

### Reset database
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec app npm run init-db
```
