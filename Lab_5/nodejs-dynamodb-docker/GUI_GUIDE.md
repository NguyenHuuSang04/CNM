# 🎨 HƯỚNG DẪN SỬ DỤNG GUI

## 🚀 Cách Mở Giao Diện Web

### Cách 1: Mở Browser Tự Động (PowerShell)
```powershell
Start-Process "http://localhost:3000"
```

### Cách 2: Mở Thủ Công
Mở trình duyệt (Chrome, Edge, Firefox) và truy cập:
```
http://localhost:3000
```

---

## 📸 Screenshot Giao Diện

Giao diện web có:
- ✅ Form thêm/sửa sản phẩm với validation
- ✅ Danh sách sản phẩm hiển thị đẹp mắt
- ✅ Nút Edit và Delete cho mỗi sản phẩm
- ✅ Toast notifications khi thành công/thất bại
- ✅ Responsive design (mobile-friendly)
- ✅ Icons và màu sắc đẹp mắt

---

## 🎯 Hướng Dẫn Sử Dụng

### 1️⃣ **THÊM Sản Phẩm Mới**

1. Điền thông tin vào form:
   - **Tên Sản Phẩm**: Ví dụ "iPhone 15 Pro Max"
   - **Giá**: Ví dụ "999"
   - **URL Hình Ảnh**: Paste link ảnh hoặc để trống

2. Click nút **"Thêm Sản Phẩm"**

3. Sản phẩm sẽ xuất hiện trong danh sách ngay lập tức

**Ví dụ:**
```
Tên: Laptop Dell XPS 15
Giá: 1200
URL: https://images.unsplash.com/photo-1593642632823-8f785ba67e45
```

---

### 2️⃣ **SỬA Sản Phẩm**

1. Click nút **"Sửa"** (màu vàng) bên cạnh sản phẩm

2. Form sẽ tự động điền thông tin sản phẩm đó

3. Chỉnh sửa thông tin cần thiết

4. Click **"Cập Nhật"**

5. Thông tin sẽ được cập nhật ngay lập tức

---

### 3️⃣ **XÓA Sản Phẩm**

1. Click nút **"Xóa"** (màu đỏ) bên cạnh sản phẩm

2. Xác nhận xóa trong popup

3. Sản phẩm sẽ bị xóa khỏi database

---

### 4️⃣ **LÀM MỚI Danh Sách**

Click nút **"Làm Mới"** ở góc phải để reload danh sách sản phẩm

---

## 🖼️ Lấy URL Hình Ảnh Từ Đâu?

### Option 1: Unsplash (Free Stock Photos)
```
https://images.unsplash.com/photo-1505740420928-5e560c06d30e
https://images.unsplash.com/photo-1523275335684-37898b6baf30
https://images.unsplash.com/photo-1572635196237-14b3f281503f
```

### Option 2: Placeholder Images
```
https://via.placeholder.com/400x300?text=Product+Image
https://picsum.photos/400/300
```

### Option 3: Upload ảnh lên Imgur/ImgBB rồi copy link

---

## ⚡ Tính Năng Giao Diện

✅ **Real-time Updates** - Không cần reload trang  
✅ **Responsive Design** - Hoạt động tốt trên mobile  
✅ **Input Validation** - Kiểm tra dữ liệu trước khi submit  
✅ **Error Handling** - Hiển thị lỗi rõ ràng  
✅ **Beautiful UI** - Bootstrap 5 + Icons  
✅ **Toast Notifications** - Thông báo đẹp mắt  

---

## 🔧 Troubleshooting

### Lỗi: Trang không tải được

**Giải pháp:**
```powershell
# Kiểm tra container đang chạy
docker-compose ps

# Restart nếu cần
docker-compose restart app

# Xem logs để debug
docker-compose logs app
```

### Lỗi: "Không thể kết nối đến server"

**Nguyên nhân:** API server chưa khởi động hoặc bị lỗi

**Giải pháp:**
```powershell
# Xem logs
docker-compose logs app

# Restart
docker-compose restart app

# Đợi 3 giây rồi mở lại
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
```

### Lỗi: Hình ảnh không hiển thị

**Nguyên nhân:** URL hình ảnh không hợp lệ hoặc bị chặn CORS

**Giải pháp:** 
- Dùng URL từ Unsplash hoặc Placeholder
- Hoặc để trống, sẽ hiện placeholder mặc định

---

## 📱 Test Trên Mobile

1. Lấy IP máy tính:
```powershell
ipconfig | Select-String "IPv4"
```

2. Truy cập từ điện thoại (cùng mạng WiFi):
```
http://YOUR_IP:3000
```

Ví dụ: `http://192.168.1.100:3000`

---

## 🎨 Tùy Chỉnh Giao Diện

File giao diện: `public/index.html`

Bạn có thể:
- Đổi màu sắc trong phần `<style>`
- Thêm/bớt trường dữ liệu
- Thay đổi layout
- Thêm tính năng mới

Sau khi sửa, restart container:
```powershell
docker-compose restart app
```

---

## 🎯 Demo Data

Thêm data mẫu để test:

**Sản phẩm 1:**
```
Tên: iPhone 15 Pro Max
Giá: 999
URL: https://images.unsplash.com/photo-1592286943541-1f8e1d4c8837
```

**Sản phẩm 2:**
```
Tên: MacBook Pro 16"
Giá: 2399
URL: https://images.unsplash.com/photo-1517336714731-489689fd1ca8
```

**Sản phẩm 3:**
```
Tên: AirPods Pro
Giá: 249
URL: https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7
```

**Sản phẩm 4:**
```
Tên: Apple Watch Ultra
Giá: 799
URL: https://images.unsplash.com/photo-1579586337278-3befd40fd17a
```

---

## ✅ Checklist Test CRUD

- [ ] Thêm sản phẩm mới → Kiểm tra xuất hiện trong list
- [ ] Sửa sản phẩm → Kiểm tra thông tin được cập nhật
- [ ] Xóa sản phẩm → Kiểm tra biến mất khỏi list
- [ ] Refresh page → Data vẫn còn (lưu trong DynamoDB)
- [ ] Test validation → Bỏ trống tên/giá xem có báo lỗi
- [ ] Test với nhiều sản phẩm → Scroll list
- [ ] Test hình ảnh → URL hợp lệ/không hợp lệ

---

## 🚀 Quick Start

```powershell
# 1. Đảm bảo containers đang chạy
docker-compose ps

# 2. Mở giao diện
Start-Process "http://localhost:3000"

# 3. Bắt đầu test CRUD!
```

---

**💡 Tip:** Mở Developer Tools (F12) trong browser để xem API calls và debug!
