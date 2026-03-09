const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { upload } = require('../config/s3');

/**
 * Wrap multer so that upload errors (file size exceeded, wrong type, etc.)
 * are attached to req.uploadError instead of crashing the pipeline.
 */
function handleUpload(req, res, next) {
    upload.single('image')(req, res, (err) => {
        if (err) {
            req.uploadError = err.message;
        } else if (req.fileValidationError) {
            req.uploadError = req.fileValidationError;
        }
        next();
    });
}

// List / search
router.get('/', ProductController.index);

// Add product
router.get('/add', ProductController.showAddForm);
router.post('/add', handleUpload, ProductController.create);

// Edit product
router.get('/edit/:id', ProductController.showEditForm);
router.post('/edit/:id', handleUpload, ProductController.update);

// Delete product
router.post('/delete/:id', ProductController.delete);

module.exports = router;