const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { upload } = require('../config/s3');
const { isAuthenticated, isAdmin, isAdminOrStaff } = require('../middlewares/auth.middleware');

// All product routes require authentication
router.use(isAuthenticated);

// View products (admin and staff)
router.get('/', isAdminOrStaff, ProductController.index);

// Admin only routes
router.get('/add', isAdmin, ProductController.showAddForm);
router.post('/add', isAdmin, upload.single('image'), ProductController.create);

router.get('/edit/:id', isAdmin, ProductController.showEditForm);
router.post('/edit/:id', isAdmin, upload.single('image'), ProductController.update);

router.post('/delete/:id', isAdmin, ProductController.delete);

// View logs (admin only)
router.get('/logs/:id', isAdmin, ProductController.showLogs);

module.exports = router;