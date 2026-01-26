require('dotenv').config();
const { S3Client, CreateBucketCommand, HeadBucketCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function createBucket() {
  try {
    // Kiểm tra xem bucket đã tồn tại chưa
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`✅ S3 Bucket "${BUCKET_NAME}" đã tồn tại.`);
      return;
    } catch (error) {
      if (error.name !== 'NotFound') {
        throw error;
      }
    }

    // Tạo bucket mới
    const createParams = {
      Bucket: BUCKET_NAME,
    };

    // Nếu region không phải us-east-1, cần thêm LocationConstraint
    if (process.env.AWS_REGION !== 'us-east-1') {
      createParams.CreateBucketConfiguration = {
        LocationConstraint: process.env.AWS_REGION,
      };
    }

    await s3Client.send(new CreateBucketCommand(createParams));
    console.log(`✅ S3 Bucket "${BUCKET_NAME}" đã được tạo thành công!`);

    // Cấu hình CORS cho bucket
    const corsParams = {
      Bucket: BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: [],
          },
        ],
      },
    };

    await s3Client.send(new PutBucketCorsCommand(corsParams));
    console.log('✅ CORS đã được cấu hình cho bucket.');

    console.log(`\n📍 Region: ${process.env.AWS_REGION}`);
    console.log(`🪣 Bucket Name: ${BUCKET_NAME}`);
    console.log('✅ Bucket đã sẵn sàng sử dụng!');
  } catch (error) {
    console.error('❌ Lỗi khi tạo S3 bucket:', error.message);
    process.exit(1);
  }
}

createBucket();
