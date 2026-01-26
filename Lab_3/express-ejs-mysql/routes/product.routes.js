const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { upload } = require('../config/s3');

// Hiển thị danh sách sản phẩm
router.get('/', ProductController.index);

// Form thêm sản phẩm
router.get('/add', ProductController.showAddForm);

// Xử lý thêm sản phẩm (với upload ảnh)
router.post('/add', upload.single('image'), ProductController.create);

// Form chỉnh sửa sản phẩm
router.get('/edit/:id', ProductController.showEditForm);

// Xử lý cập nhật sản phẩm (với upload ảnh)
router.post('/edit/:id', upload.single('image'), ProductController.update);

// Xóa sản phẩm
router.post('/delete/:id', ProductController.delete);

module.exports = router;