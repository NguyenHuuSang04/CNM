const express = require("express");
const upload = require("../middlewares/upload");
const { validateProductInput } = require("../middlewares/validation");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", productController.list);
router.get("/products/new", productController.showCreate);
router.post(
  "/products",
  upload.single("url_image"),
  validateProductInput,
  productController.create
);
router.get("/products/:id", productController.detail);
router.get("/products/:id/edit", productController.showEdit);
router.put(
  "/products/:id",
  upload.single("url_image"),
  validateProductInput,
  productController.update
);
router.delete("/products/:id", productController.remove);

module.exports = router;
