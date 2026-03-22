const express = require("express");
// const app = express(); // Của thầy
const router = express.Router();

const subjectRoute = require("./subject.route");

router.use("/subjects", subjectRoute);

module.exports = router;