const express = require("express");
const upload = require("../middleware/upload");
const controller = require("../controllers");

const router = express.Router();

router.get("/", controller.get);
router.get("/create", controller.showCreateForm);
router.post("/create", upload, controller.create);
router.get("/:id/edit", controller.showEditForm);
router.post("/:id/update", upload, controller.update);
router.post("/:id/delete", controller.delete);
router.get("/:id", controller.getOne);

module.exports = router;
