require("dotenv").config();
const {s3} = require("../utils/aws-helper"); // import s3 service

//Hàm randomString sẽ tạo ra mọt chuỗi ngẫu nhiên với độ dài numberCharacter ký tự dùng để tạo tên file
const randomString = numberCharacter => {
    return `${Math.random()
    .toString(36)
    .substring(2, numberCharacter + 2)}`;
};

//mảng file_Tyle_Math chứa các laoij file đc phép upload lên aws
const FILE_TYPE_MATCH = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "video/mp3",
    "video/mp4",
    "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.rar",
  "application/zip",
];

// Hàm uploadFile sẽ thực hiện upload file lên AWS s3
const uploadFile = async file => {
    // B1: tạo tên file mới với định dạng: random
    // B2: Kiểm tra loại file có phù hợp với FILE_TYPE_MATCH
    // B3: Tạo 1 object uploadParams chứa thông của file cần upload
    // B4: thực hiện upload file lên aws s3 bằng method upload
    // B5: Trả về thông tin của file đã upload
    // B6: Xử lý lỗi nếu có

    const filePath = `${randomString(4)}-${new Date().getTime()}-${file?.originalname}`; // tạo tên file mới

    //Kiểm tra loại file có phù hợp với FILE_TYPE_MATCH
    if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
        throw new Error(`${file?.originalname} không hợp lệ`);
    }

    //Tạo object uploadParams chứa thông tin của file cần upload
    const uploadParams = {
        Bucket: process.env.BUCKET_NAME, // tên bucket đã tạo trong s3
        Body: file?.buffer, // Dữ liệu của file dưới dạng buffer
        Key:filePath, // Tên file mới
        ContentType: file?.mimetype, // Loại file
    };

    try {
        const data = await s3.upload(uploadParams).promise(); //thực hiện upload file lên aws s3 bằng method upload

        console.log(`File upload thành công. ${data.Location}`);

        const fileUrl = process.env.CLOUDFRONT_URL
            ? `${process.env.CLOUDFRONT_URL}${data.Key}`
            : data.Location;

        return fileUrl;

    } catch (err) {
        console.error("Lỗi khi đang upload ảnh lên AWS S3:", err);
        throw new Error("Upload ảnh thất bại");
    }
}

const getObjectKeyFromUrl = fileUrl => {
    if (!fileUrl) {
        return "";
    }

    const cloudfrontBase = (process.env.CLOUDFRONT_URL || "").replace(/\/+$/, "");
    if (cloudfrontBase && fileUrl.startsWith(cloudfrontBase)) {
        return fileUrl.replace(cloudfrontBase, "").replace(/^\/+/, "");
    }

    try {
        const parsed = new URL(fileUrl);
        const keyFromPath = parsed.pathname.replace(/^\/+/, "");
        if (keyFromPath) {
            return decodeURIComponent(keyFromPath);
        }
    } catch (_error) {
        return fileUrl.replace(/^\/+/, "");
    }

    return "";
};

const deleteFileByUrl = async fileUrl => {
    const key = getObjectKeyFromUrl(fileUrl);
    if (!key) {
        return;
    }

    if (!process.env.BUCKET_NAME) {
        throw new Error("Missing BUCKET_NAME in .env");
    }

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    };

    await s3.deleteObject(params).promise();
};

module.exports = {
    uploadFile,
    deleteFileByUrl,
};