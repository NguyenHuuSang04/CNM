const express = require("express");
const path = require("path");
const app = express();

// Cấu hình cổng (EB thường dùng 8080) 
const PORT = process.env.PORT || 8080; 

// Cấu hình View Engine là EJS 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware để đọc dữ liệu từ Form và phục vụ file tĩnh 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/", productRoutes);

// Endpoint kiểm tra sức khỏe (Health Check) - Bắt buộc cho AWS
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));