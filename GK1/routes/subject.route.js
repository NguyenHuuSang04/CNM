const express = require("express"); // import thư viện express
const router = express.Router(); // khởi tạo 1 router từ express
const subjectController = require("../controllers"); // import controller từ file controller/index.js
const upload = require("../middleware/upload");

router.get("/", subjectController.get) ; // API endpoint lấy all các subject
router.get("/create", subjectController.showCreateForm); // Hiển thị form thêm môn học
router.post("/create", upload, subjectController.create); // Xử lý thêm môn học
router.post("/:id/update", upload, subjectController.update); // Cập nhật môn học, có thể thay ảnh mới
router.post("/:id/delete", subjectController.delete); // Xóa môn học theo id + name
router.get("/:id", subjectController.getOne); // API endpoint lấy thông tin của subject dựa vào id

module.exports = router;