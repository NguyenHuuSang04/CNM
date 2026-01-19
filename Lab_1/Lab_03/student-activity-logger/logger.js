const EventEmitter = require('events');
const fs = require('fs');

// Tạo class kế thừa từ EventEmitter
class StudentLogger extends EventEmitter {}
const logger = new StudentLogger();

// // Hàm ghi nội dung vào file activity.log
// const path = require('path'); 

// function logToFile(message) {
//     const date = new Date().toISOString().split('T')[0]; // Lấy ngày YYYY-MM-DD 
//     const dir = 'logs';

//     // Tự động tạo thư mục logs nếu chưa tồn tại 
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//     }

//     const filePath = path.join(dir, `activity-${date}.log`); // Tạo đường dẫn file 
//     fs.appendFile(filePath, message + '\n', () => {});
// }

// Đăng ký các trình lắng nghe (Listeners)
logger.on('login', (studentName) => {
    logToFile(`Student ${studentName} logged in`);
});

logger.on('view_lesson', (data) => {
    logToFile(`Student ${data.name} viewed lesson ${data.lesson}`);
});

logger.on('submit_assignment', (data) => {
    logToFile(`Student ${data.name} submitted assignment ${data.assignment}`);
});

// Bài tập 1
// Xuất logger để file khác có thể sử dụng
module.exports = logger;

logger.on('logout', (name) => {
    logToFile(`Student ${name} logged out`);
});

//Bài tập 2: Ghi nhận điểm Quiz 
logger.on('quiz_attempt', (data) => {
    logToFile(`Student ${data.name} attempted quiz: ${data.score}/${data.total}`);
});




// Bài tập 3: Quản lý thư mục logs và Tên file theo ngày
// Hàm ghi nội dung vào file activity.log
const path = require('path'); 

function logToFile(message) {
    const date = new Date().toISOString().split('T')[0]; // Lấy ngày YYYY-MM-DD 
    const dir = 'logs';

    // Tự động tạo thư mục logs nếu chưa tồn tại 
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const filePath = path.join(dir, `activity-${date}.log`); // Tạo đường dẫn file 
    fs.appendFile(filePath, message + '\n', () => {});
}



//Bài tập 4: Ghi nhật ký lỗi (Advanced)
logger.on('error', (err) => {
    fs.appendFile('error.log', err + '\n', () => {});
});