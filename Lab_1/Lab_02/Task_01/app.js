const fs = require('fs');

// Bước 1.3: Đọc file bất đồng bộ
fs.readFile('input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log('File content:');
    console.log(data);
});

// Bước 1.4: Ghi file bất đồng bộ
fs.writeFile('output.txt', 'File written using Node.js fs module!', (err) => {
    if (err) {
        console.error('Error writing file:', err);
        return;
    }
    console.log('File written successfully!');
});

//Bước 1.5
fs.appendFile('output.txt', '\nAppending new content...', (err) => {
    if (err) {
        console.error(err)
        return;
    }
    console.log('Data appended!'); 
});