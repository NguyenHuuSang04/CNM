const fs = require('fs');
const path = require('path');

// Các thư mục bạn muốn quét (dựa theo ảnh của bạn)
const foldersToScan = ['controllers', 'middleware', 'models', 'routes', 'service', 'utils', 'views'];
const outputFilePath = './snippets.json'; // File này sẽ dùng cho Extension

let snippets = {};

foldersToScan.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath);

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            if (fs.lstatSync(filePath).isFile()) {
                const content = fs.readFileSync(filePath, 'utf8');
                const ext = path.extname(file).replace('.', ''); // js, ejs, css...
                const fileNameOnly = path.basename(file, path.extname(file)).replace(/[^a-zA-Z0-9]/g, '');

                // Quy tắc: [folder][tên file][đuôi]
                const prefix = `${folder}${fileNameOnly}${ext}`;

                snippets[prefix] = {
                    "prefix": prefix,
                    "body": content.split('\n'),
                    "description": `Code từ file ${folder}/${file}`
                };
            }
        });
    }
});

fs.writeFileSync(outputFilePath, JSON.stringify(snippets, null, 2));
console.log(`✅ Đã tạo xong file snippets.json với ${Object.keys(snippets).length} cú pháp!`);