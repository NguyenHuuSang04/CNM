function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Xuất các hàm để file khác có thể sử dụng
module.exports = {
  add,
  subtract
};