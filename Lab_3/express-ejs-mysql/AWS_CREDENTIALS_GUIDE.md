# 🔑 Hướng dẫn lấy AWS Credentials

## ❌ Lỗi bạn đang gặp:

```
UnrecognizedClientException: The security token included in the request is invalid.
```

**Nguyên nhân:** File `.env` chưa có AWS credentials thật, đang dùng giá trị mặc định!

---

## ✅ CÁCH SỬA (3 bước):

### Bước 1: Đăng nhập AWS Console

1. Truy cập: https://console.aws.amazon.com/
2. Đăng nhập với tài khoản AWS của bạn

### Bước 2: Tạo Access Key

#### **Option A: Nếu bạn đã có IAM User**

1. Vào **IAM** service (search "IAM" ở thanh tìm kiếm)
2. Click **Users** (menu bên trái)
3. Click vào username của bạn
4. Tab **Security credentials**
5. Scroll xuống phần **Access keys**
6. Click **Create access key**
7. Chọn use case: **Application running outside AWS** → Next
8. (Optional) Thêm description → **Create access key**
9. **⚠️ QUAN TRỌNG:** Copy ngay cả 2 giá trị:
   - **Access key ID** (bắt đầu bằng AKIA...)
   - **Secret access key** (chỉ hiển thị 1 lần duy nhất!)
10. Click **Download .csv file** để backup
11. Click **Done**

#### **Option B: Nếu chưa có IAM User**

1. Vào **IAM** → **Users** → **Create user**
2. Username: `your-name-dev` → Next
3. **Attach policies directly**
4. Search và chọn:
   - ✅ `AmazonDynamoDBFullAccess`
   - ✅ `AmazonS3FullAccess`
5. Next → **Create user**
6. Click vào user vừa tạo
7. Tab **Security credentials** → **Create access key**
8. Follow các bước như Option A

### Bước 3: Cập nhật file .env

1. Mở file `.env` trong project
2. Thay đổi:

```env
# ❌ TRƯỚC (giá trị mặc định - SAI):
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# ✅ SAU (credentials thật):
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

3. Lưu file `.env`

---

## 🧪 Kiểm tra Credentials

Chạy script test:

```bash
npm run test-aws
```

**Kết quả mong đợi:**

```
✅ Kết nối AWS thành công!
📊 DynamoDB Tables:
   - Users
   - Categories
   - Products
   - ProductLogs
```

**Nếu thấy lỗi:**

```
❌ AWS Credentials KHÔNG HỢP LỆ!
```

→ Kiểm tra lại Access Key ID và Secret Access Key

---

## 🔒 Cấu hình Permissions (IAM Policy)

User cần có quyền sau:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:*"
      ],
      "Resource": "*"
    }
  ]
}
```

**Hoặc attach managed policies:**
- `AmazonDynamoDBFullAccess`
- `AmazonS3FullAccess`

---

## 📝 Checklist Setup

- [ ] Đã đăng nhập AWS Console
- [ ] Đã tạo hoặc có IAM User
- [ ] IAM User có quyền DynamoDB và S3
- [ ] Đã tạo Access Key
- [ ] Đã copy Access Key ID và Secret Access Key
- [ ] Đã cập nhật file `.env` với credentials thật
- [ ] Chạy `npm run test-aws` thành công
- [ ] Chạy `npm run create-tables` để tạo DynamoDB tables
- [ ] Chạy `npm run seed` để seed dữ liệu
- [ ] Chạy `npm start` để khởi động app

---

## 🚨 Lưu ý Bảo mật

1. **KHÔNG BAO GIỜ** commit file `.env` lên Git
2. **KHÔNG BAO GIỜ** share Secret Access Key công khai
3. File `.env` đã có trong `.gitignore`
4. Nếu lỡ leak credentials, xóa ngay trong IAM Console
5. Rotate access keys định kỳ (3-6 tháng)

---

## 🔄 Nếu Credentials bị lỗi

1. **Xóa Access Key cũ:**
   - IAM → Users → Your User → Security credentials
   - Tìm access key → **Deactivate** → **Delete**

2. **Tạo Access Key mới** (follow Bước 2 bên trên)

3. **Cập nhật file .env** với credentials mới

---

## 📞 Support

Nếu vẫn gặp vấn đề:

1. Chạy `npm run test-aws` và gửi output
2. Check IAM User có đủ permissions chưa
3. Verify region đúng: `AWS_REGION=ap-southeast-1`

---

## 🎯 Next Steps

Sau khi credentials đã OK:

```bash
# 1. Test credentials
npm run test-aws

# 2. Tạo DynamoDB tables
npm run create-tables

# 3. Seed dữ liệu mẫu
npm run seed

# 4. Khởi động app
npm start

# 5. Truy cập
# http://localhost:3000
# Login: admin / admin123
```

---

**✅ Sau khi làm xong, bạn sẽ thấy màn hình login và có thể đăng nhập!**
