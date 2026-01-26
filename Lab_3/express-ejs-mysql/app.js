require('dotenv').config();
const express = require('express');
const app = express();

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// 2. Middleware để xử lý dữ liệu từ Form
app.use(express.urlencoded({ extended: true }));

// 3. Cấu hình thư mục public cho CSS/JS/Images
app.use(express.static('public'));

// 4. Sử dụng Routes
const productRoutes = require('./routes/product.routes');
app.use('/', productRoutes);

// 5. Khởi động Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📊 DynamoDB Table: ${process.env.DYNAMODB_TABLE_NAME}`);
  console.log(`🪣 S3 Bucket: ${process.env.S3_BUCKET_NAME}`);
});