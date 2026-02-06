# Quick Start Guide

Hướng dẫn nhanh để chạy ứng dụng trong 5 phút.

## ⚡ Yêu cầu

- ✅ Node.js 18+ đã cài đặt
- ✅ Tài khoản AWS (có thể dùng Free Tier)
- ✅ AWS Access Key ID và Secret Access Key

## 🚀 Các bước thực hiện

### 1. Clone và cài đặt

```bash
# Clone project (hoặc download ZIP)
git clone <repository-url>
cd express-ejs-dynamodb

# Cài đặt dependencies
npm install
```

### 2. Cấu hình AWS Credentials

**Cách 1: Sử dụng AWS CLI (Khuyến nghị)**

```bash
# Cài đặt AWS CLI từ: https://aws.amazon.com/cli/
aws configure

# Nhập thông tin:
# AWS Access Key ID: <your-key>
# AWS Secret Access Key: <your-secret>
# Default region: ap-southeast-1
# Default output format: json
```

**Cách 2: Sử dụng file .env**

```bash
# Tạo file .env từ template
cp .env.example .env

# Chỉnh sửa .env với editor
notepad .env  # Windows
nano .env     # Linux/macOS
```

Nội dung file `.env`:
```env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
DYNAMODB_TABLE_NAME=Products
S3_BUCKET_NAME=product-app-<your-name>
PORT=3000
NODE_ENV=development
```

⚠️ **Lưu ý:** Thay `<your-name>` bằng tên của bạn để bucket name là unique!

### 3. Tạo DynamoDB Table và S3 Bucket

```bash
npm run setup
```

Chờ đến khi thấy:
```
✅ Bảng DynamoDB đã được tạo thành công!
✅ S3 Bucket đã được tạo thành công!
```

### 4. (Optional) Thêm dữ liệu mẫu

```bash
npm run seed
```

### 5. Chạy ứng dụng

```bash
npm start
```

Mở trình duyệt: **http://localhost:3000**

## 🎉 Xong!

Bạn có thể:
- ✅ Xem danh sách sản phẩm
- ✅ Thêm sản phẩm mới với hình ảnh
- ✅ Sửa thông tin sản phẩm
- ✅ Xóa sản phẩm

---

## 🔧 Troubleshooting

### Lỗi: "Missing credentials"

**Giải pháp:**
```bash
# Kiểm tra credentials
aws sts get-caller-identity

# Nếu chưa cấu hình, chạy:
aws configure
```

### Lỗi: "Bucket already exists"

**Giải pháp:** Đổi tên bucket trong `.env`:
```env
S3_BUCKET_NAME=product-app-yourname-12345
```

Sau đó chạy lại:
```bash
npm run setup
```

### Lỗi: "Cannot find module"

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json  # Linux/macOS
rmdir /s node_modules                   # Windows

npm install
```

### Port 3000 đã được sử dụng

**Giải pháp:** Đổi port trong `.env`:
```env
PORT=3001
```

---

## 📝 Scripts có sẵn

```bash
npm start            # Chạy ứng dụng
npm run dev          # Chạy với nodemon (auto-restart)
npm run setup        # Tạo DynamoDB table + S3 bucket
npm run seed         # Thêm dữ liệu mẫu
```

---

## 🌐 Deploy lên AWS EC2

Xem hướng dẫn chi tiết tại: [AWS_SETUP_GUIDE.md](AWS_SETUP_GUIDE.md)

**Tóm tắt:**
1. Tạo EC2 instance với IAM Role
2. SSH vào EC2 và cài Node.js
3. Clone code lên EC2
4. Cài dependencies: `npm install --production`
5. Chạy với PM2: `pm2 start app.js`

---

## 📚 Tài liệu đầy đủ

- **README.md** - Tổng quan và hướng dẫn chi tiết
- **AWS_SETUP_GUIDE.md** - Hướng dẫn cấu hình AWS từng bước
- **BAO_CAO_MINI_PROJECT.md** - Báo cáo kỹ thuật đầy đủ

---

## 💡 Tips

1. **Kiểm tra chi phí AWS:** https://console.aws.amazon.com/billing/
2. **Xem logs:** Check terminal output hoặc PM2 logs
3. **Test AWS credentials:** `aws sts get-caller-identity`
4. **Xem DynamoDB items:** AWS Console → DynamoDB → Tables → Products → Explore items
5. **Xem S3 files:** AWS Console → S3 → your-bucket-name → products/

---

## ❓ Cần trợ giúp?

- Đọc [README.md](README.md) để biết thêm chi tiết
- Xem [AWS_SETUP_GUIDE.md](AWS_SETUP_GUIDE.md) nếu gặp vấn đề AWS
- Check [Issues](https://github.com/yourusername/yourrepo/issues) trên GitHub

---

**Happy Coding! 🚀**
