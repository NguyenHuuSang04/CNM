const _ = require('lodash'); // Nhập thư viện lodash

const numbers = [1, 2, 3, 4, 5];
const shuffled = _.shuffle(numbers); // Xáo trộn mảng

console.log('Original:', numbers);
console.log('Shuffled:', shuffled);