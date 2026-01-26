# Express EJS DynamoDB - Quản lý Sản phẩm trên AWS

Ứng dụng quản lý sản phẩm với Node.js, Express, EJS, DynamoDB và S3 - triển khai hoàn toàn trên Amazon Web Services.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc MVC](#cấu-trúc-mvc)
- [Thiết kế dữ liệu](#thiết-kế-dữ-liệu)
- [Cài đặt Local](#cài-đặt-local)
- [Triển khai lên AWS](#triển-khai-lên-aws)
- [Tính năng](#tính-năng)

## 🎯 Giới thiệu

Đây là ứng dụng web CRUD (Create, Read, Update, Delete) quản lý sản phẩm được xây dựng theo mô hình MVC với các tính năng:
- ✅ Quản lý danh sách sản phẩm (xem, thêm, sửa, xóa)
- ✅ Upload và lưu trữ hình ảnh sản phẩm trên Amazon S3
- ✅ Lưu trữ dữ liệu sản phẩm trên Amazon DynamoDB (NoSQL)
- ✅ Triển khai ứng dụng trên Amazon EC2
- ✅ Tích hợp AWS SDK v3

## 🏗️ Kiến trúc hệ thống

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ HTTP Request
       ▼
┌──────────────────────────────┐
│    Amazon EC2                │
│  ┌────────────────────────┐  │
│  │   Node.js + Express    │  │
│  │   (Ứng dụng web)       │  │
│  └────────┬─────────┬─────┘  │
└───────────┼─────────┼────────┘
            │         │
   ┌────────▼─────┐   └──────────┐
   │              │               │
┌──▼────────────┐ │     ┌────────▼──────────┐
│  DynamoDB     │ │     │   Amazon S3       │
│  (Products)   │ │     │   (Hình ảnh)      │
└───────────────┘ │     └───────────────────┘
                  │
                  │ AWS SDK v3
                  │
            ┌─────▼──────┐
            │  IAM Role  │
            │    or      │
            │ Access Key │
            └────────────┘
```

## 💻 Công nghệ sử dụng

### Backend
- **Node.js** 18+
- **Express.js** 5.x - Web framework
- **EJS** 4.x - Template engine
- **AWS SDK v3** - DynamoDB & S3 client
- **Multer** & **Multer-S3** - File upload middleware
- **UUID** - Generate unique product IDs

### AWS Services
- **Amazon EC2** - Chạy ứng dụng Node.js
- **Amazon DynamoDB** - NoSQL database cho dữ liệu sản phẩm
- **Amazon S3** - Lưu trữ hình ảnh sản phẩm
- **IAM** - Quản lý quyền truy cập

### Frontend
- **EJS Templates** - Server-side rendering
- **HTML5 & CSS3** - Giao diện người dùng
- **Responsive Design** - Tương thích mobile

## 📁 Cấu trúc MVC

```
express-ejs-dynamodb/
├── models/              # Models - Xử lý logic database
│   ├── product.model.js # CRUD operations với DynamoDB
│   └── user.model.js
├── views/               # Views - Giao diện EJS
│   ├── products.ejs     # Danh sách sản phẩm
│   ├── add-product.ejs  # Form thêm sản phẩm
│   ├── edit-product.ejs # Form chỉnh sửa sản phẩm
│   ├── login.ejs
│   └── index.ejs
├── controllers/         # Controllers - Xử lý logic nghiệp vụ
│   ├── product.controller.js # Product CRUD handlers
│   └── auth.controller.js
├── routes/              # Routes - Định tuyến
│   └── product.routes.js
├── config/              # Configuration files
│   ├── dynamodb.js      # DynamoDB client setup
│   └── s3.js            # S3 client & multer config
├── scripts/             # Utility scripts
│   ├── create-dynamodb-table.js
│   └── create-s3-bucket.js
├── public/              # Static files
│   └── css/
│       └── style.css
├── app.js               # Entry point
├── package.json
├── .env.example         # Environment variables template
└── README.md
```

## 🗄️ Thiết kế dữ liệu

### Bảng DynamoDB: Products

| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|-------|
| **id** | String (Partition Key) | UUID - Mã sản phẩm duy nhất |
| name | String | Tên sản phẩm |
| price | Number | Giá sản phẩm (VNĐ) |
| quantity | Number | Số lượng tồn kho |
| url_image | String | Đường dẫn hình ảnh trên S3 |
| createdAt | String | Thời gian tạo (ISO 8601) |

**Ví dụ Item:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "iPhone 15 Pro Max",
  "price": 29990000,
  "quantity": 50,
  "url_image": "https://your-bucket.s3.ap-southeast-1.amazonaws.com/products/1234567890-iphone.jpg",
  "createdAt": "2026-01-26T10:30:00.000Z"
}
```

### S3 Bucket Structure

```
your-bucket-name/
└── products/
    ├── 1706260800000-product1.jpg
    ├── 1706260900000-product2.png
    └── 1706261000000-product3.jpg
```

## 🚀 Cài đặt Local

### Bước 1: Clone và cài đặt dependencies

```bash
# Clone project (nếu từ Git)
git clone <repository-url>
cd express-ejs-dynamodb

# Cài đặt dependencies
npm install
```

### Bước 2: Cấu hình AWS Credentials

#### Option 1: Sử dụng AWS CLI (Khuyến nghị)

```bash
# Cài đặt AWS CLI
# Windows: Download từ https://aws.amazon.com/cli/
# macOS: brew install awscli
# Linux: sudo apt install awscli

# Cấu hình credentials
aws configure
# AWS Access Key ID: <your-access-key>
# AWS Secret Access Key: <your-secret-key>
# Default region name: ap-southeast-1
# Default output format: json
```

#### Option 2: Sử dụng file .env

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
# AWS Configuration
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=Products

# S3 Configuration
S3_BUCKET_NAME=your-unique-bucket-name

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Bước 3: Tạo DynamoDB Table và S3 Bucket

```bash
# Tạo bảng DynamoDB
node scripts/create-dynamodb-table.js

# Tạo S3 Bucket
node scripts/create-s3-bucket.js
```

**Output mong đợi:**
```
✅ Bảng DynamoDB đã được tạo thành công!
📊 Tên bảng: Products
📍 Region: ap-southeast-1
🔑 Partition Key: id (String)
✅ Bảng đã sẵn sàng sử dụng!

✅ S3 Bucket "your-bucket-name" đã được tạo thành công!
✅ CORS đã được cấu hình cho bucket.
✅ Bucket đã sẵn sàng sử dụng!
```

### Bước 4: Chạy ứng dụng

```bash
npm start
```

Truy cập: http://localhost:3000

---

## ☁️ Triển khai lên AWS EC2

### 📝 Quy trình triển khai chi tiết

#### **Bước 1: Chuẩn bị IAM Role cho EC2**

1. **Đăng nhập AWS Console** → Tìm **IAM**

2. **Tạo Policy cho DynamoDB và S3:**
   - Click "Policies" → "Create policy"
   - JSON tab, dán code sau:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:ap-southeast-1:*:table/Products"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
      ]
    }
  ]
}
```
   
   - Name: `ProductAppPolicy`
   - Create policy

3. **Tạo IAM Role:**
   - Click "Roles" → "Create role"
   - Trusted entity: **AWS service** → **EC2**
   - Attach policy: `ProductAppPolicy`
   - Role name: `ProductAppEC2Role`
   - Create role

#### **Bước 2: Launch EC2 Instance**

1. **Vào EC2 Console** → "Launch Instance"

2. **Cấu hình:**
   - Name: `product-app-server`
   - AMI: **Amazon Linux 2023** hoặc **Ubuntu 22.04 LTS**
   - Instance type: `t2.micro` (Free tier) hoặc `t3.small`
   - Key pair: Tạo mới hoặc chọn existing (để SSH)
   - **IAM instance profile:** Chọn `ProductAppEC2Role` ⭐ **QUAN TRỌNG**
   
3. **Security Group:**
   - Inbound rules:
     - SSH (22): My IP
     - HTTP (80): 0.0.0.0/0
     - Custom TCP (3000): 0.0.0.0/0
   
4. Click "Launch Instance"

#### **Bước 3: SSH vào EC2 và cài đặt môi trường**

```bash
# SSH vào EC2
ssh -i "your-key.pem" ec2-user@<EC2-Public-IP>

# Update system
sudo yum update -y  # Amazon Linux
# sudo apt update && sudo apt upgrade -y  # Ubuntu

# Cài đặt Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -  # Amazon Linux
sudo yum install -y nodejs

# Hoặc trên Ubuntu:
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt install -y nodejs

# Cài đặt Git
sudo yum install -y git  # Amazon Linux
# sudo apt install -y git  # Ubuntu

# Verify
node --version
npm --version
```

#### **Bước 4: Deploy ứng dụng**

```bash
# Clone code từ Git
git clone <your-repo-url>
cd express-ejs-dynamodb

# Hoặc upload code qua SCP từ máy local:
# scp -i "your-key.pem" -r ./express-ejs-dynamodb ec2-user@<EC2-IP>:~/

# Cài đặt dependencies
npm install --production

# Tạo file .env
nano .env
```

**Nội dung file .env:**
```env
# Không cần AWS credentials khi dùng IAM Role!
AWS_REGION=ap-southeast-1

# DynamoDB Configuration
DYNAMODB_TABLE_NAME=Products

# S3 Configuration
S3_BUCKET_NAME=your-bucket-name

# Server Configuration
PORT=3000
NODE_ENV=production
```

⚠️ **Lưu ý:** Khi sử dụng IAM Role, KHÔNG cần `AWS_ACCESS_KEY_ID` và `AWS_SECRET_ACCESS_KEY`

#### **Bước 5: Chạy ứng dụng với PM2**

```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Start ứng dụng
pm2 start app.js --name "product-app"

# Lưu PM2 process list
pm2 save

# Tự động start PM2 khi reboot
pm2 startup
# Copy và chạy command mà PM2 hiển thị

# Kiểm tra status
pm2 status
pm2 logs product-app
```

#### **Bước 6: Truy cập ứng dụng**

Mở trình duyệt: `http://<EC2-Public-IP>:3000`

---

### 🔒 Cấu hình Nginx Reverse Proxy (Optional nhưng khuyến nghị)

```bash
# Cài đặt Nginx
sudo yum install -y nginx  # Amazon Linux
# sudo apt install -y nginx  # Ubuntu

# Cấu hình Nginx
sudo nano /etc/nginx/conf.d/product-app.conf
```

**Nội dung:**
```nginx
server {
    listen 80;
    server_name <your-domain-or-IP>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Kiểm tra cấu hình
sudo nginx -t

# Truy cập: http://<EC2-Public-IP>
```

---

### 🌐 Cấu hình Domain và SSL (Production)

#### Bước 1: Trỏ domain về EC2

Tại nhà cung cấp domain, tạo A record:
```
Type: A
Name: @ (hoặc subdomain)
Value: <EC2-Public-IP>
TTL: 300
```

#### Bước 2: Cài đặt SSL với Let's Encrypt

```bash
# Cài đặt Certbot
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
# sudo apt install -y certbot python3-certbot-nginx  # Ubuntu

# Lấy SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot-renew.timer

# Test auto-renew
sudo certbot renew --dry-run
```

Truy cập: `https://yourdomain.com`

---

## 📊 Các lệnh quản lý AWS Resources

### DynamoDB Commands

```bash
# Liệt kê các bảng
aws dynamodb list-tables --region ap-southeast-1

# Mô tả bảng
aws dynamodb describe-table --table-name Products --region ap-southeast-1

# Scan toàn bộ items
aws dynamodb scan --table-name Products --region ap-southeast-1

# Get item
aws dynamodb get-item --table-name Products \
  --key '{"id":{"S":"your-product-id"}}' \
  --region ap-southeast-1

# Delete item
aws dynamodb delete-item --table-name Products \
  --key '{"id":{"S":"your-product-id"}}' \
  --region ap-southeast-1
```

### S3 Commands

```bash
# Liệt kê buckets
aws s3 ls

# Liệt kê files trong bucket
aws s3 ls s3://your-bucket-name/products/

# Upload file
aws s3 cp local-file.jpg s3://your-bucket-name/products/

# Download file
aws s3 cp s3://your-bucket-name/products/file.jpg ./

# Xóa file
aws s3 rm s3://your-bucket-name/products/file.jpg

# Đồng bộ folder
aws s3 sync ./local-folder s3://your-bucket-name/products/
```

---

## 🎯 Tính năng CRUD

### 1. Create - Thêm sản phẩm
- Nhập: tên, giá, số lượng
- Upload hình ảnh lên S3
- Tạo UUID tự động
- Lưu vào DynamoDB

### 2. Read - Xem danh sách sản phẩm
- Hiển thị bảng sản phẩm
- Hiển thị hình ảnh từ S3
- Format giá VNĐ

### 3. Update - Cập nhật sản phẩm
- Chỉnh sửa thông tin
- Thay đổi hình ảnh (xóa ảnh cũ trên S3)
- Cập nhật DynamoDB

### 4. Delete - Xóa sản phẩm
- Xóa item trong DynamoDB
- Xóa hình ảnh trên S3

---

## 🔒 Bảo mật Best Practices

### ✅ Checklist

- [ ] Sử dụng IAM Role thay vì Access Key cho EC2
- [ ] Cấu hình Security Groups hạn chế IP
- [ ] Enable HTTPS với SSL certificate
- [ ] Set `NODE_ENV=production`
- [ ] Không commit file `.env` lên Git
- [ ] Enable S3 bucket versioning
- [ ] Enable DynamoDB Point-in-Time Recovery
- [ ] Enable CloudWatch Logs
- [ ] Cấu hình S3 bucket policy phù hợp
- [ ] Sử dụng AWS Secrets Manager cho sensitive data

### Ví dụ S3 Bucket Policy (Public Read cho hình ảnh)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/products/*"
    }
  ]
}
```

---

## 📈 Giám sát và Logging

### PM2 Monitoring

```bash
# Xem status
pm2 status

# Xem logs real-time
pm2 logs product-app

# Monitoring dashboard
pm2 monit

# Chi tiết process
pm2 show product-app

# Restart app
pm2 restart product-app

# Stop app
pm2 stop product-app
```

### CloudWatch Integration (Optional)

```bash
# Cài đặt PM2 CloudWatch module
pm2 install pm2-cloudwatch

# Configure
pm2 set pm2-cloudwatch:aws_region ap-southeast-1
pm2 set pm2-cloudwatch:log_group_name /aws/ec2/product-app
```

---

## 💰 Ước tính chi phí AWS

### Free Tier (12 tháng đầu)

| Service | Free Tier | Giới hạn |
|---------|-----------|----------|
| EC2 (t2.micro) | 750 giờ/tháng | 1 instance running 24/7 |
| S3 | 5 GB storage | + 20,000 GET, 2,000 PUT |
| DynamoDB | 25 GB storage | + 25 WCU + 25 RCU |
| Data Transfer | 100 GB/tháng | Outbound |

### Sau Free Tier (ap-southeast-1)

| Service | Chi phí | Mô tả |
|---------|---------|-------|
| EC2 t3.micro | ~$7/tháng | 730 giờ |
| S3 Storage | $0.025/GB | 10 GB = $0.25/tháng |
| DynamoDB | $0.283/GB | 1 GB = $0.28/tháng |
| Data Transfer | $0.12/GB | Sau 100 GB |
| **Tổng ước tính** | **~$10-15/tháng** | Cho traffic nhỏ |

---

## 🛠️ Troubleshooting

### Lỗi: "Cannot connect to DynamoDB"

```bash
# Kiểm tra IAM Role
aws sts get-caller-identity

# Kiểm tra table
aws dynamodb describe-table --table-name Products --region ap-southeast-1

# Kiểm tra .env
cat .env
```

### Lỗi: "S3 Access Denied"

```bash
# Kiểm tra bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Test upload
aws s3 cp test.txt s3://your-bucket-name/test.txt
```

### Ứng dụng không start

```bash
# Xem logs PM2
pm2 logs product-app --lines 100

# Xem logs Node.js
node app.js  # Chạy trực tiếp để debug

# Kiểm tra port
sudo netstat -tlnp | grep 3000
```

---

## 📚 Tech Stack Summary

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 5.x |
| **Template** | EJS 4.x |
| **Database** | Amazon DynamoDB |
| **Storage** | Amazon S3 |
| **Compute** | Amazon EC2 |
| **SDK** | AWS SDK for JavaScript v3 |
| **File Upload** | Multer, Multer-S3 |
| **Process Manager** | PM2 |
| **Reverse Proxy** | Nginx (optional) |

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

ISC License

---

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

---

## 📞 Support

Nếu có vấn đề, hãy tạo [Issue](https://github.com/yourusername/yourrepo/issues) trên GitHub.

---

## 📖 Tài liệu tham khảo

- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [Amazon S3 User Guide](https://docs.aws.amazon.com/s3/)
- [Express.js Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)

---

**⭐ Nếu project này hữu ích, đừng quên cho một star nhé!**
