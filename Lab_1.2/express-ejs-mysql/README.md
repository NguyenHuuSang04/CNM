# Express EJS MySQL - Quản lý Sản phẩm

Ứng dụng quản lý sản phẩm với Express.js, EJS và MySQL theo mô hình MVC, sẵn sàng triển khai lên AWS.

## 📋 Mục lục

- [Cấu trúc MVC](#cấu-trúc-mvc)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt Local](#cài-đặt-local)
- [Chạy với Docker](#chạy-với-docker)
- [Triển khai lên AWS](#triển-khai-lên-aws)
- [Tính năng](#tính-năng)

## 🏗️ Cấu trúc MVC

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
├── public/             # Static files
│   └── css/
│       └── style.css
├── app.js              # Entry point
├── .env                # Environment variables
├── Dockerfile          # Docker config cho Node app
├── docker-compose.yml  # Docker Compose cho Node + MySQL
└── init.sql           # Script khởi tạo database
```

## 📦 Yêu cầu

- **Node.js** 18+ 
- **MySQL** 8.0+ (hoặc AWS RDS)
- **Docker & Docker Compose** (tùy chọn)
- **AWS Account** (cho deployment)

## 🚀 Cài đặt Local

### Bước 1: Clone và cài đặt dependencies

```bash
# Clone project (nếu từ Git)
git clone <repository-url>
cd express-ejs-mysql

# Cài đặt dependencies
npm install
```

### Bước 2: Cấu hình môi trường

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopdb
SESSION_SECRET=your_generated_secret_key
PORT=3000
NODE_ENV=development
```

### Bước 3: Tạo database

```sql
CREATE DATABASE shopdb;
USE shopdb;

-- Import init.sql
source init.sql;
```

### Bước 4: Chạy ứng dụng

```bash
npm start
```

Truy cập: http://localhost:3000/login

---

## 🐳 Chạy với Docker

### Khởi động toàn bộ stack (Node + MySQL):

```bash
docker-compose up -d
```

### Các lệnh Docker hữu ích:

```bash
# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Xóa cả volumes (reset database)
docker-compose down -v

# Rebuild
docker-compose up --build
```

---

## ☁️ Triển khai lên AWS

### 📝 Quy trình triển khai chi tiết

#### **Phương án 1: EC2 + RDS (Khuyến nghị cho production)**

##### **Bước 1: Chuẩn bị AWS RDS (MySQL Database)**

1. **Đăng nhập AWS Console** → Tìm **RDS**

2. **Tạo Database:**
   - Click "Create database"
   - Chọn: **MySQL** (version 8.0+)
   - Templates: **Free tier** (cho học tập) hoặc **Production**
   - Settings:
     - DB instance identifier: `shopdb-mysql`
     - Master username: `admin`
     - Master password: `<tạo-mật-khẩu-mạnh>`
   - Instance configuration: `db.t3.micro` (free tier) hoặc cao hơn
   - Storage: 20 GB (có thể tăng)
   - Connectivity:
     - VPC: Default VPC
     - Public access: **Yes** (để test, production nên để No)
     - VPC security group: Tạo mới hoặc chọn existing
     - Port: `3306`

3. **Cấu hình Security Group:**
   - Vào **EC2** → **Security Groups**
   - Chọn security group của RDS
   - **Inbound rules** → Edit:
     - Type: MySQL/Aurora
     - Protocol: TCP
     - Port: 3306
     - Source: 
       - `0.0.0.0/0` (cho test - **KHÔNG AN TOÀN cho production**)
       - Hoặc IP cụ thể của EC2 instance

4. **Import Database:**
   ```bash
   # Từ máy local hoặc EC2
   mysql -h <RDS-endpoint> -u admin -p shopdb < init.sql
   ```

##### **Bước 2: Chuẩn bị EC2 Instance (Node.js Server)**

1. **Launch EC2 Instance:**
   - AMI: **Amazon Linux 2023** hoặc **Ubuntu 22.04**
   - Instance type: `t2.micro` (free tier) hoặc `t3.small`
   - Key pair: Tạo mới hoặc chọn existing (để SSH)
   - Security Group:
     - SSH (22): Your IP
     - HTTP (80): 0.0.0.0/0
     - HTTPS (443): 0.0.0.0/0
     - Custom TCP (3000): 0.0.0.0/0 (hoặc dùng reverse proxy)

2. **SSH vào EC2:**
   ```bash
   ssh -i "your-key.pem" ec2-user@<EC2-Public-IP>
   ```

3. **Cài đặt Node.js và dependencies:**
   ```bash
   # Amazon Linux 2023
   sudo yum update -y
   sudo yum install -y nodejs npm git
   
   # Ubuntu
   sudo apt update
   sudo apt install -y nodejs npm git
   
   # Verify
   node --version
   npm --version
   ```

4. **Cài đặt PM2 (Process Manager):**
   ```bash
   sudo npm install -g pm2
   ```

##### **Bước 3: Deploy ứng dụng lên EC2**

1. **Clone hoặc upload code:**
   ```bash
   # Option 1: Clone từ Git
   git clone <your-repo-url>
   cd express-ejs-mysql
   
   # Option 2: Upload qua SCP
   scp -i "your-key.pem" -r ./express-ejs-mysql ec2-user@<EC2-IP>:~/
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install --production
   ```

3. **Tạo file .env:**
   ```bash
   nano .env
   ```
   
   Nội dung:
   ```env
   DB_HOST=<RDS-endpoint>
   DB_USER=admin
   DB_PASSWORD=<RDS-password>
   DB_NAME=shopdb
   SESSION_SECRET=<generate-strong-secret>
   PORT=3000
   NODE_ENV=production
   ```

4. **Chạy ứng dụng với PM2:**
   ```bash
   pm2 start app.js --name "shopdb-app"
   pm2 save
   pm2 startup
   ```

5. **Kiểm tra:**
   ```bash
   pm2 status
   pm2 logs shopdb-app
   ```

6. **Truy cập:**
   - http://<EC2-Public-IP>:3000

##### **Bước 4: Cấu hình Nginx Reverse Proxy (Optional nhưng khuyến nghị)**

1. **Cài đặt Nginx:**
   ```bash
   sudo yum install -y nginx  # Amazon Linux
   sudo apt install -y nginx  # Ubuntu
   ```

2. **Cấu hình Nginx:**
   ```bash
   sudo nano /etc/nginx/conf.d/shopdb.conf
   ```
   
   Nội dung:
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

3. **Khởi động Nginx:**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

4. **Truy cập:** http://<EC2-Public-IP>

##### **Bước 5: Cấu hình SSL với Let's Encrypt (Production)**

```bash
# Cài đặt Certbot
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu

# Lấy SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot-renew.timer
```

---

#### **Phương án 2: Elastic Beanstalk (Đơn giản hơn)**

##### **Bước 1: Chuẩn bị code**

1. **Thêm file `.ebextensions/nodecommand.config`:**
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
   ```

2. **Đảm bảo có file package.json với:**
   ```json
   {
     "scripts": {
       "start": "node app.js"
     }
   }
   ```

##### **Bước 2: Deploy**

```bash
# Cài đặt EB CLI
pip install awsebcli

# Initialize EB
eb init -p node.js-18 shopdb-app --region us-east-1

# Tạo environment
eb create shopdb-env

# Deploy
eb deploy

# Mở trình duyệt
eb open
```

##### **Bước 3: Cấu hình Environment Variables**

```bash
eb setenv DB_HOST=<RDS-endpoint> DB_USER=admin DB_PASSWORD=<password> DB_NAME=shopdb SESSION_SECRET=<secret> NODE_ENV=production
```

---

#### **Phương án 3: ECS với Docker (Advanced)**

##### **Bước 1: Push Docker image lên ECR**

```bash
# Đăng nhập ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tạo repository
aws ecr create-repository --repository-name shopdb-app

# Build và push
docker build -t shopdb-app .
docker tag shopdb-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/shopdb-app:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/shopdb-app:latest
```

##### **Bước 2: Tạo ECS Cluster và Task Definition**

1. Vào **ECS Console** → Create Cluster (Fargate)
2. Create Task Definition với image từ ECR
3. Add environment variables
4. Create Service và deploy

---

### 🔒 Checklist bảo mật cho Production

- [ ] Thay đổi tất cả passwords mặc định
- [ ] Sử dụng RDS trong private subnet
- [ ] Cấu hình Security Groups đúng cách
- [ ] Enable SSL/HTTPS
- [ ] Set NODE_ENV=production
- [ ] Không hardcode secrets trong code
- [ ] Enable CloudWatch logging
- [ ] Backup database thường xuyên
- [ ] Update dependencies thường xuyên

---

### 📊 Giám sát và Logs

#### CloudWatch Logs (cho EC2 + PM2)

```bash
# Cài đặt CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Cấu hình để gửi PM2 logs lên CloudWatch
pm2 install pm2-cloudwatch
```

#### Xem logs PM2

```bash
pm2 logs shopdb-app
pm2 monit
```

---

### 💰 Ước tính chi phí AWS (Free Tier)

| Service | Free Tier | Chi phí sau free tier |
|---------|-----------|----------------------|
| EC2 (t2.micro) | 750h/tháng (12 tháng) | ~$8/tháng |
| RDS (db.t3.micro) | 750h/tháng (12 tháng) | ~$15/tháng |
| Data Transfer | 15 GB/tháng | $0.09/GB |
| **Tổng (sau free tier)** | | ~$25-30/tháng |

---

## 🎯 Tính năng

✅ **Authentication:** Đăng nhập với session
✅ **CRUD Operations:** Quản lý sản phẩm đầy đủ
✅ **MVC Pattern:** Cấu trúc rõ ràng, dễ bảo trì
✅ **Docker Support:** Containerized với Docker Compose
✅ **AWS Ready:** Sẵn sàng triển khai lên AWS
✅ **Environment Variables:** Quản lý config qua .env
✅ **Modern UI:** Giao diện đẹp, responsive
✅ **Auto Init DB:** Database tự động khởi tạo

---

## 👤 Tài khoản đăng nhập mặc định

| Username | Password | Role |
|----------|----------|------|
| admin | 123456 | Admin |
| user1 | password123 | User |

---

## 🛠️ Scripts hữu ích

```bash
# Development
npm start              # Chạy app

# Docker
docker-compose up -d   # Start services
docker-compose down    # Stop services
docker-compose logs -f # Xem logs

# PM2 (trên server)
pm2 start app.js       # Start app
pm2 restart app        # Restart
pm2 logs               # Xem logs
pm2 monit              # Monitor
```

---

## 📚 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS Templates, CSS3
- **Database:** MySQL 8.0
- **Session:** express-session
- **Environment:** dotenv
- **Deployment:** Docker, AWS EC2, AWS RDS

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

**⭐ Nếu project này hữu ích, đừng quên cho một star nhé!**
