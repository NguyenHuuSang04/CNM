const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route hiển thị danh sách sản phẩm
router.get("/", productController.index);

// Route thêm sản phẩm mới
router.post("/add", productController.add);

// Route xóa sản phẩm
router.post("/delete", productController.delete);

module.exports = router;
