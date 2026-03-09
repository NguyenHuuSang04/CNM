require('dotenv').config();
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const path = require('path');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer with memory storage — files held in buffer, then pushed to S3 manually
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        // Store the validation error on req so the route can surface it
        req.fileValidationError = 'Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)!';
        cb(null, false);
    },
});

/**
 * Upload a file buffer to S3.
 * @param {import('multer').File} file  - multer file object (memoryStorage)
 * @returns {Promise<string>}           - public object URL
 */
async function uploadToS3(file) {
    const region = process.env.AWS_REGION || 'us-east-1';
    const bucket = process.env.S3_BUCKET_NAME;
    const safeName = file.originalname.replace(/\s+/g, '-');
    const key = `products/${Date.now()}-${safeName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * Delete an object from S3 by its URL.
 * Errors are swallowed (non-fatal) so they do not block DynamoDB operations.
 * @param {string} imageUrl - full S3 URL
 */
async function deleteFromS3(imageUrl) {
    if (!imageUrl) return;
    try {
        const urlParts = new URL(imageUrl);
        const key = decodeURIComponent(urlParts.pathname.slice(1)); // strip leading '/'
        await s3Client.send(
            new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key })
        );
        console.log(`S3: deleted ${key}`);
    } catch (err) {
        console.error('S3 delete error (non-fatal):', err.message);
    }
}

module.exports = { s3Client, upload, uploadToS3, deleteFromS3 };