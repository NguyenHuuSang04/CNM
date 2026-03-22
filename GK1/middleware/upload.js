const multer = require("multer");

//Set up Multer storage options
// Sử dụng memoryStorage sẽ giúp chúng ta thao tác với các tập tin trước khi lưu vào bộ bnhows hoặc database
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, "/"); //
    }
});

// tạo multer middleware để tỉa lên 1 tập tin
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 *5, // Option để quản lý file size, ở đây là maximum file size được upload
    }
}).single("image"); // phương thức để chỉ định cho phép upload 1 or nhiều file
// với phương thức này đc chỉ định chỉ cho upload 1 file 
// "image" chính là tên của input bên form ( client )

module.exports = upload;