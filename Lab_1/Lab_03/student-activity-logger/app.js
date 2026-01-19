const logger = require('./logger');

// Mô phỏng các hành động bằng cách phát (emit) sự kiện
logger.emit('login', 'Alice');

logger.emit('view_lesson', {
    name: 'Alice',
    lesson: 'Node.js Events'
});

logger.emit('submit_assignment', {
    name: 'Alice',
    assignment: 'Lab 3'
});

// Bài tập 1
logger.emit('logout', 'Alice');


//Bài tập 2: Ghi nhận điểm Quiz 
logger.emit('quiz_attempt', {
    name: 'Bob',
    score: 8,
    total: 10
});








//Bài tập 4: Ghi nhật ký lỗi (Advanced)
logger.emit('error', 'Database connection failed');