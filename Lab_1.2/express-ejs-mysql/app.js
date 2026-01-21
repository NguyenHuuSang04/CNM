require('dotenv').config();
const express = require('express'); 
const session = require('express-session');
const app = express(); 

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs'); 
app.set('views', './views'); 

// 2. Middleware để xử lý dữ liệu từ Form (đọc dữ liệu POST)
app.use(express.urlencoded({ extended: true })); 

// 2.5. Cấu hình thư mục public cho CSS/JS/Images
app.use(express.static('public'));

// 3. Cấu hình Session (PHẢI ĐẶT TRƯỚC ROUTES)
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 3600000, // Session tồn tại trong 1 giờ
    secure: process.env.NODE_ENV === 'production' // HTTPS only in production
  }
}));

// 4. Nhập và sử dụng các Route (đường dẫn) của sản phẩm
const productRoutes = require('./routes/product.routes'); 
app.use('/', productRoutes); 

// 5. Khởi động Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`Server running at http://localhost:${PORT}`); 
});

