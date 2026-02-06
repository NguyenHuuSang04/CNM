# Hướng dẫn cấu hình AWS cho Mini Project

Tài liệu này hướng dẫn chi tiết cách cấu hình các dịch vụ AWS cần thiết cho ứng dụng.

## 📋 Mục lục

1. [Tạo tài khoản AWS](#1-tạo-tài-khoản-aws)
2. [Cấu hình IAM User](#2-cấu-hình-iam-user)
3. [Tạo DynamoDB Table](#3-tạo-dynamodb-table)
4. [Tạo S3 Bucket](#4-tạo-s3-bucket)
5. [Cấu hình EC2](#5-cấu-hình-ec2)
6. [Deploy ứng dụng](#6-deploy-ứng-dụng)

---

## 1. Tạo tài khoản AWS

### Bước 1: Đăng ký AWS Account

1. Truy cập: https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Nhập email, password, và AWS account name
4. Chọn loại tài khoản: **Personal**
5. Nhập thông tin thanh toán (cần thẻ tín dụng/debit card)
   - AWS sẽ verify bằng cách trừ $1 và hoàn lại
6. Xác thực số điện thoại
7. Chọn gói: **Basic Support - Free**

### Bước 2: Kích hoạt Free Tier

- Free Tier tự động kích hoạt khi tạo tài khoản mới
- Có hiệu lực 12 tháng từ ngày đăng ký
- Kiểm tra: AWS Console → Billing Dashboard

---

## 2. Cấu hình IAM User

### Tại sao cần IAM User?

- ⚠️ **KHÔNG sử dụng Root Account** cho hoạt động hàng ngày
- IAM User có quyền hạn giới hạn, an toàn hơn
- Có thể tạo Access Keys cho programmatic access

### Bước 1: Tạo IAM User

1. Đăng nhập AWS Console
2. Tìm dịch vụ **IAM**
3. Click **Users** → **Create user**
4. Cấu hình:
   - User name: `product-app-user`
   - ☑️ Provide user access to the AWS Management Console (optional)
   - ☑️ I want to create an IAM user
   - Console password: Custom password
   - ☐ Users must create a new password at next sign-in

### Bước 2: Gán quyền (Permissions)

**Option 1: Attach policies directly (Đơn giản cho học tập)**

Chọn các policies sau:
- ✅ `AmazonDynamoDBFullAccess`
- ✅ `AmazonS3FullAccess`
- ✅ `AmazonEC2FullAccess`

**Option 2: Tạo Custom Policy (Khuyến nghị cho production)**

1. Click **Create policy** → JSON tab
2. Dán code sau:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/Products"
    },
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:ListBucket",
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutBucketCors",
        "s3:PutBucketPolicy"
      ],
      "Resource": [
        "arn:aws:s3:::*",
        "arn:aws:s3:::*/*"
      ]
    }
  ]
}
```

3. Policy name: `ProductAppPolicy`
4. Create policy
5. Quay lại tạo user và attach policy này

### Bước 3: Tạo Access Keys

1. Vào user vừa tạo → **Security credentials** tab
2. Scroll xuống **Access keys** → **Create access key**
3. Use case: **Application running outside AWS**
4. Click **Next** → Create access key
5. ⚠️ **LƯU LẠI** Access Key ID và Secret Access Key
   - Download .csv file
   - **Không chia sẻ với ai!**
   - Chỉ hiển thị 1 lần duy nhất

---

## 3. Tạo DynamoDB Table

### Option 1: Sử dụng AWS Console (Giao diện)

1. Tìm dịch vụ **DynamoDB**
2. Click **Create table**
3. Cấu hình:
   - Table name: `Products`
   - Partition key: `id` (String)
   - Table settings: **Default settings**
   - Read/write capacity: **On-demand**
4. Click **Create table**
5. Đợi status: `Active` (1-2 phút)

### Option 2: Sử dụng Script (Khuyến nghị)

```bash
# Cấu hình credentials trước
npm run setup
# hoặc
node scripts/create-dynamodb-table.js
```

### Kiểm tra Table

```bash
aws dynamodb describe-table --table-name Products --region ap-southeast-1
```

---

## 4. Tạo S3 Bucket

### Yêu cầu tên Bucket

- ✅ Phải unique trên toàn bộ AWS (globally unique)
- ✅ Chỉ chữ thường, số, gạch ngang (-)
- ✅ Từ 3-63 ký tự
- ❌ Không có dấu cách, chữ hoa, ký tự đặc biệt

### Option 1: Sử dụng AWS Console

1. Tìm dịch vụ **S3**
2. Click **Create bucket**
3. Cấu hình:
   - Bucket name: `product-app-images-<username>` (thay <username>)
   - AWS Region: **ap-southeast-1 (Singapore)**
   - Object Ownership: **ACLs disabled**
   - Block Public Access: **Bỏ tích** "Block all public access"
     - ☑️ Tích vào "I acknowledge..."
   - Bucket Versioning: Disabled (hoặc Enabled nếu muốn)
   - Default encryption: **Server-side encryption with Amazon S3 managed keys (SSE-S3)**
4. Click **Create bucket**

### Option 2: Sử dụng Script

```bash
# Đảm bảo đã cấu hình S3_BUCKET_NAME trong .env
node scripts/create-s3-bucket.js
```

### Cấu hình CORS cho Bucket

1. Vào bucket vừa tạo
2. **Permissions** tab → **Cross-origin resource sharing (CORS)**
3. Click **Edit** → Dán code:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

4. Save changes

### Cấu hình Bucket Policy (Public Read)

1. **Permissions** tab → **Bucket policy**
2. Click **Edit** → Dán code (thay `your-bucket-name`):

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

3. Save changes

### Test Upload

```bash
echo "test" > test.txt
aws s3 cp test.txt s3://your-bucket-name/test.txt
aws s3 ls s3://your-bucket-name/
```

---

## 5. Cấu hình EC2

### Bước 1: Tạo IAM Role cho EC2

1. IAM Console → **Roles** → **Create role**
2. Trusted entity: **AWS service** → **EC2**
3. Permissions:
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
4. Role name: `ProductAppEC2Role`
5. Create role

### Bước 2: Launch EC2 Instance

1. EC2 Console → **Launch Instance**
2. Cấu hình:
   - **Name**: `product-app-server`
   - **AMI**: Amazon Linux 2023 (hoặc Ubuntu 22.04 LTS)
   - **Instance type**: `t2.micro` (Free Tier)
   - **Key pair**: Create new
     - Key pair name: `product-app-key`
     - Key pair type: RSA
     - Private key format: `.pem`
     - **Download và lưu file .pem**
   - **Network settings**:
     - ☑️ Allow SSH traffic from: My IP
     - ☑️ Allow HTTP traffic from the internet
     - ☑️ Allow HTTPS traffic from the internet
   - **Advanced details**:
     - IAM instance profile: `ProductAppEC2Role` ⭐

3. **Launch instance**

### Bước 3: Cấu hình Security Group

1. EC2 → **Instances** → chọn instance
2. **Security** tab → Click vào Security group
3. **Inbound rules** → **Edit inbound rules** → **Add rule**:
   - Type: Custom TCP
   - Port: 3000
   - Source: 0.0.0.0/0 (Anywhere)
4. Save rules

### Bước 4: Elastic IP (Optional - để IP không đổi)

1. EC2 → **Elastic IPs** → **Allocate Elastic IP address**
2. Allocate
3. **Actions** → **Associate Elastic IP address**
4. Chọn instance và Associate

---

## 6. Deploy ứng dụng

### Bước 1: SSH vào EC2

**Windows (PowerShell):**
```powershell
# Set quyền cho file .pem
icacls product-app-key.pem /inheritance:r
icacls product-app-key.pem /grant:r "$($env:USERNAME):(R)"

# SSH
ssh -i product-app-key.pem ec2-user@<EC2-Public-IP>
```

**macOS/Linux:**
```bash
chmod 400 product-app-key.pem
ssh -i product-app-key.pem ec2-user@<EC2-Public-IP>
```

### Bước 2: Cài đặt Node.js

```bash
# Amazon Linux 2023
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git

# Ubuntu 22.04
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify
node --version
npm --version
```

### Bước 3: Clone code

```bash
# Option 1: Clone từ Git
git clone <your-repo-url>
cd express-ejs-dynamodb

# Option 2: Upload từ local (từ máy local)
# scp -i product-app-key.pem -r ./express-ejs-dynamodb ec2-user@<EC2-IP>:~/
```

### Bước 4: Cài đặt dependencies

```bash
npm install --production
```

### Bước 5: Tạo file .env

```bash
nano .env
```

**Nội dung** (không cần AWS credentials khi dùng IAM Role):
```env
AWS_REGION=ap-southeast-1
DYNAMODB_TABLE_NAME=Products
S3_BUCKET_NAME=your-bucket-name
PORT=3000
NODE_ENV=production
```

### Bước 6: Chạy ứng dụng với PM2

```bash
# Cài PM2
sudo npm install -g pm2

# Start app
pm2 start app.js --name "product-app"

# Auto-start on reboot
pm2 startup
# Copy và chạy lệnh mà PM2 hiển thị

pm2 save

# Kiểm tra
pm2 status
pm2 logs
```

### Bước 7: Truy cập ứng dụng

Mở trình duyệt: `http://<EC2-Public-IP>:3000`

---

## 🎉 Hoàn tất!

Ứng dụng của bạn đã chạy trên AWS với:
- ✅ EC2 (Compute)
- ✅ DynamoDB (Database)
- ✅ S3 (Storage)
- ✅ IAM (Security)

---

## 🔍 Troubleshooting

### Lỗi: "Access Denied" khi tạo table/bucket

**Nguyên nhân:** Credentials không đúng hoặc thiếu quyền

**Giải pháp:**
```bash
# Kiểm tra credentials
aws sts get-caller-identity

# Nếu chưa cấu hình
aws configure
```

### Lỗi: "Bucket name already exists"

**Nguyên nhân:** Tên bucket phải unique globally

**Giải pháp:** Đổi tên bucket trong `.env`:
```env
S3_BUCKET_NAME=product-app-images-yourname-12345
```

### Lỗi: Cannot connect to EC2

**Kiểm tra:**
- ✅ Security Group có mở port 22 (SSH) và 3000
- ✅ File .pem có quyền đúng (chmod 400)
- ✅ IP public đúng

### Lỗi: "npm: command not found" trên EC2

```bash
# Cài lại Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

---

## 📝 Checklist Deploy

- [ ] IAM User đã tạo và có Access Keys
- [ ] DynamoDB table "Products" đã tạo
- [ ] S3 Bucket đã tạo và cấu hình CORS
- [ ] IAM Role cho EC2 đã tạo
- [ ] EC2 instance đã launch với IAM Role
- [ ] Security Group đã mở port 3000
- [ ] Node.js đã cài trên EC2
- [ ] Code đã upload/clone lên EC2
- [ ] File .env đã cấu hình đúng
- [ ] PM2 đã cài và app đang chạy
- [ ] Có thể truy cập http://<EC2-IP>:3000

---

## 💡 Tips

1. **Theo dõi chi phí:** AWS Billing Dashboard → Budget → Create budget
2. **Backup:** Enable DynamoDB Point-in-Time Recovery
3. **Monitoring:** Sử dụng CloudWatch để theo dõi logs
4. **Domain:** Mua domain và trỏ về EC2 Elastic IP
5. **SSL:** Cài đặt Let's Encrypt sau khi có domain

---

## 📚 Tài liệu tham khảo

- [AWS Free Tier](https://aws.amazon.com/free/)
- [DynamoDB Getting Started](https://docs.aws.amazon.com/dynamodb/latest/developerguide/GettingStartedDynamoDB.html)
- [S3 User Guide](https://docs.aws.amazon.com/s3/index.html)
- [EC2 User Guide](https://docs.aws.amazon.com/ec2/index.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
