const mysql = require('mysql2');

// Tạo một pool kết nối để tối ưu hiệu suất
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'shopdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Xuất ra dạng Promise để có thể dùng async/await sau này
module.exports = pool.promise();