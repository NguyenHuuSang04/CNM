require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

async function testS3Upload() {
  console.log('🧪 Test S3 Upload/Download...\n');

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.S3_BUCKET_NAME;

  console.log(`📦 Bucket: ${bucketName}`);
  console.log(`🌍 Region: ${process.env.AWS_REGION}\n`);

  try {
    // Tạo file test đơn giản
    const testContent = 'Hello from Express EJS App! Test upload at ' + new Date().toISOString();
    const testFileName = 'test-' + Date.now() + '.txt';

    console.log('📤 Đang upload file test...');
    
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: 'products/' + testFileName,
      Body: testContent,
      ContentType: 'text/plain',
    });

    await client.send(uploadCommand);
    console.log(`✅ Upload thành công: products/${testFileName}`);

    // Tạo URL
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/products/${testFileName}`;
    console.log(`\n🔗 URL: ${fileUrl}`);
    console.log('\n💡 Thử truy cập URL trên để kiểm tra public access');
    console.log('   Nếu bị lỗi AccessDenied, cần config Bucket Policy\n');

    // Test download
    console.log('📥 Đang download lại để verify...');
    const downloadCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: 'products/' + testFileName,
    });

    const response = await client.send(downloadCommand);
    const downloadedContent = await response.Body.transformToString();
    
    console.log('✅ Download thành công!');
    console.log('📄 Nội dung:', downloadedContent);

    console.log('\n✅ S3 hoạt động bình thường!');
    console.log('💡 Giờ bạn có thể upload ảnh từ app');

  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
    
    if (error.name === 'NoSuchBucket') {
      console.log('\n💡 Bucket không tồn tại hoặc region sai!');
      console.log('   Kiểm tra:');
      console.log('   1. Bucket name: ' + bucketName);
      console.log('   2. Region: ' + process.env.AWS_REGION);
      console.log('   3. Bucket có tồn tại trên AWS Console không?');
    } else if (error.name === 'AccessDenied') {
      console.log('\n💡 Không có quyền truy cập!');
      console.log('   IAM User cần policy: AmazonS3FullAccess');
    }
  }
}

testS3Upload();
