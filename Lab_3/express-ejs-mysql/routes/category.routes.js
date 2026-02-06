const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

// All category routes require authentication
router.use(isAuthenticated);

// List categories
router.get('/', CategoryController.index);

// Admin only routes
router.get('/add', isAdmin, CategoryController.showAddForm);
router.post('/add', isAdmin, CategoryController.create);

router.get('/edit/:id', isAdmin, CategoryController.showEditForm);
router.post('/edit/:id', isAdmin, CategoryController.update);

router.post('/delete/:id', isAdmin, CategoryController.delete);

module.exports = router;
