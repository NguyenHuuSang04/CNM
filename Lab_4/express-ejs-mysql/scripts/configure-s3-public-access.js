require('dotenv').config();
const { S3Client, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

async function setPublicReadPolicy() {
  console.log('🔓 Cấu hình Public Read cho S3 bucket...\n');

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET_NAME;

  // Policy cho phép public read
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };

  try {
    console.log(`📦 Bucket: ${bucketName}`);
    console.log(`🌍 Region: ${process.env.AWS_REGION}\n`);

    await client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      })
    );

    console.log('✅ Bucket Policy đã được set!');
    console.log('🌐 Tất cả file trong bucket giờ có thể truy cập public');
    console.log('\n📋 Policy:');
    console.log(JSON.stringify(policy, null, 2));

    console.log('\n💡 Test bằng cách upload ảnh từ app và xem URL');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    
    if (error.name === 'AccessDenied') {
      console.log('\n⚠️  Cần "Block Public Access" tắt!');
      console.log('\n🔧 Làm thủ công trên AWS Console:');
      console.log('1. Vào S3 → Bucket: ' + bucketName);
      console.log('2. Tab "Permissions"');
      console.log('3. "Block public access" → Edit');
      console.log('4. Bỏ tick tất cả → Save');
      console.log('5. Chạy lại script này: npm run config-s3-public');
    }
  }
}

setPublicReadPolicy();
