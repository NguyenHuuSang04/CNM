const { s3 } = require("../utils/aws-helper");

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

const randomKey = originalName => {
    const safeName = (originalName || "image").replace(/\s+/g, "-");
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
};

const uploadFile = async file => {
    if (!file) {
        throw new Error("Missing file");
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new Error("Unsupported image type");
    }

    const bucket = process.env.BUCKET_NAME;
    if (!bucket) {
        throw new Error("Missing BUCKET_NAME in .env");
    }

    const key = randomKey(file.originalname);

    const result = await s3.upload({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    }).promise();

    const cloudfront = (process.env.CLOUDFRONT_URL || "").replace(/\/+$/, "");
    return cloudfront ? `${cloudfront}/${key}` : result.Location;
};

const getObjectKeyFromUrl = fileUrl => {
    if (!fileUrl) {
        return "";
    }

    const cloudfront = (process.env.CLOUDFRONT_URL || "").replace(/\/+$/, "");
    if (cloudfront && fileUrl.startsWith(cloudfront)) {
        return fileUrl.replace(cloudfront, "").replace(/^\/+/, "");
    }

    try {
        const parsed = new URL(fileUrl);
        return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    } catch (_error) {
        return "";
    }
};

const deleteFileByUrl = async fileUrl => {
    const key = getObjectKeyFromUrl(fileUrl);
    if (!key) {
        return;
    }

    const bucket = process.env.BUCKET_NAME;
    if (!bucket) {
        return;
    }

    await s3.deleteObject({
        Bucket: bucket,
        Key: key,
    }).promise();
};

module.exports = { uploadFile, deleteFileByUrl };
