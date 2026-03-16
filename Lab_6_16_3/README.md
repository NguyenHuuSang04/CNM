# Lab 6 - Product Management (Node.js + Express + EJS + DynamoDB Local)

## 1) Yêu cầu môi trường
- Node.js 18+
- Docker Desktop

## 2) Cài đặt và chạy
1. Tạo file môi trường:
   - Copy `.env.example` thành `.env`
2. Chạy DynamoDB Local bằng Docker:
   - `docker compose up -d`
3. Cài package:
   - `npm install`
4. Khởi tạo bảng Products:
   - `npm run db:init`
5. Chạy ứng dụng:
   - `npm run dev`
6. Truy cập:
   - `http://localhost:3000`

## 3) Tính năng đã làm
- Hiển thị danh sách sản phẩm bằng bảng EJS có hình ảnh
- Thêm sản phẩm + upload ảnh + lưu đường dẫn ảnh vào DynamoDB
- Sửa sản phẩm + cập nhật ảnh
- Xóa sản phẩm
- Xem chi tiết sản phẩm

## 4) Điểm cộng khuyến khích
- Validate dữ liệu nhập
- Thông báo thành công/thất bại (flash message)
- Tìm kiếm sản phẩm theo tên
- Xóa ảnh cũ khi cập nhật/xóa sản phẩm
- UI nâng cấp, responsive

## 5) Cấu trúc MVC
- `server.js`: cấu hình app, middleware, khởi chạy server
- `routes/productRoutes.js`: điều hướng các chức năng sản phẩm
- `controllers/productController.js`: xử lý nghiệp vụ
- `models/productModel.js`: thao tác DynamoDB
- `views/products/*.ejs`: giao diện người dùng
- `public/uploads`: thư mục ảnh upload

## 6) Bảng DynamoDB
- Tên bảng: `Products`
- Partition key: `id` (String)
- Thuộc tính lưu dữ liệu: `id`, `name`, `price`, `unit_in_stock`, `url_image`
