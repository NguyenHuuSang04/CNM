require('dotenv').config();
const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');

async function configureCORS() {
  console.log('🔧 Cấu hình CORS cho S3 bucket...\n');

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET_NAME;

  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        AllowedOrigins: ['*'], // Trong production nên chỉ định domain cụ thể
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000,
      },
    ],
  };

  try {
    console.log(`📦 Bucket: ${bucketName}`);
    console.log(`🌍 Region: ${process.env.AWS_REGION}\n`);

    // Set CORS
    await client.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: corsConfiguration,
      })
    );

    console.log('✅ CORS đã được cấu hình thành công!');

    // Verify CORS
    const result = await client.send(
      new GetBucketCorsCommand({
        Bucket: bucketName,
      })
    );

    console.log('\n📋 CORS Rules hiện tại:');
    console.log(JSON.stringify(result.CORSRules, null, 2));
  } catch (error) {
    console.error('❌ Lỗi khi cấu hình CORS:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 Bucket không tồn tại! Kiểm tra:');
      console.log('   - S3_BUCKET_NAME trong .env');
      console.log('   - Region đúng chưa?');
    }
  }
}

configureCORS();
