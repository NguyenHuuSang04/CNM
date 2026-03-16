# HƯỚNG DẪN CHẠY CHƯƠNG TRÌNH

## 1. Cài đặt Dependencies

```bash
npm install
```

## 2. Cấu hình môi trường

Điền thông tin AWS vào file `.env`:

```env
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
DYNAMODB_TABLE=Products_Sang_gk
S3_BUCKET_NAME=your-s3-bucket-name-here
```

**Lấy AWS credentials:**
- Truy cập [AWS IAM Console](https://console.aws.amazon.com/iam/)
- Tạo Access Key tại Security Credentials
- Tạo S3 Bucket trên AWS Console

## 3. Tạo bảng DynamoDB

```bash
npm run setup
```

Lệnh này sẽ tự động tạo bảng DynamoDB với tên được cấu hình trong `.env`

## 4. Chạy ứng dụng

**Chạy production:**
```bash
npm start
```

**Chạy development (auto-reload):**
```bash
npm run dev
```

## 5. Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:3000`

## Các chức năng chính

- **Xem danh sách sản phẩm**: Trang chủ
- **Thêm sản phẩm**: Click nút "Thêm sản phẩm mới"
- **Sửa sản phẩm**: Click nút "Sửa" trên mỗi sản phẩm
- **Xóa sản phẩm**: Click nút "Xóa" trên mỗi sản phẩm

## Lưu ý

- Hình ảnh sản phẩm được lưu trên S3
- Dữ liệu sản phẩm được lưu trên DynamoDB
- File upload giới hạn 5MB, chỉ chấp nhận: jpeg, jpg, png, gif, webp
