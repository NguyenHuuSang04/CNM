const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const ProductController = require('../controllers/product.controller');

// Middleware kiểm tra đăng nhập
const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// === Authentication Routes ===
// 1. Hiển thị trang Login
router.get('/login', AuthController.showLoginPage);

// 2. Xử lý đăng nhập
router.post('/login', AuthController.login);

// 3. Xử lý đăng xuất
router.get('/logout', AuthController.logout);

// === Product Routes (Protected) ===
// 4. Trang chủ - Danh sách sản phẩm
router.get('/', authMiddleware, ProductController.index);

// 5. Hiển thị Form thêm sản phẩm
router.get('/add', authMiddleware, ProductController.showAddForm);

// 6. Xử lý thêm sản phẩm (POST)
router.post('/add', authMiddleware, ProductController.create);

// 7. Hiển thị Form chỉnh sửa sản phẩm
router.get('/edit/:id', authMiddleware, ProductController.showEditForm);

// 8. Xử lý cập nhật sản phẩm (POST)
router.post('/update/:id', authMiddleware, ProductController.update);

// 9. Xử lý xóa sản phẩm
router.get('/delete/:id', authMiddleware, ProductController.delete);

module.exports = router;