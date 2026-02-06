require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// 2. Middleware để xử lý dữ liệu từ Form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 3. Cấu hình Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// 4. Middleware để truyền user vào tất cả views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 5. Cấu hình thư mục public cho CSS/JS/Images
app.use(express.static('public'));

// 6. Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');

app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

// Redirect root to products
app.get('/', (req, res) => {
  res.redirect('/products');
});

// 7. Khởi động Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📊 DynamoDB Table: ${process.env.DYNAMODB_TABLE_NAME}`);
  console.log(`🪣 S3 Bucket: ${process.env.S3_BUCKET_NAME}`);
});
