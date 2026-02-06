require('dotenv').config();
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');

async function listBuckets() {
  console.log('📋 Liệt kê S3 buckets...\n');

  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const response = await client.send(new ListBucketsCommand({}));
    
    console.log(`✅ Tìm thấy ${response.Buckets.length} buckets:\n`);
    
    response.Buckets.forEach((bucket, index) => {
      console.log(`${index + 1}. ${bucket.Name}`);
      console.log(`   Created: ${bucket.CreationDate}`);
    });

    console.log('\n💡 Kiểm tra xem bucket "' + process.env.S3_BUCKET_NAME + '" có trong danh sách không');
    
    const found = response.Buckets.find(b => b.Name === process.env.S3_BUCKET_NAME);
    if (found) {
      console.log('✅ Bucket tồn tại!');
    } else {
      console.log('❌ Bucket KHÔNG tồn tại!');
      console.log('\n🔧 Cần tạo bucket mới:');
      console.log('1. Vào AWS Console → S3');
      console.log('2. Create bucket');
      console.log('3. Name: ' + process.env.S3_BUCKET_NAME);
      console.log('4. Region: ' + process.env.AWS_REGION);
    }

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    
    if (error.name === 'InvalidAccessKeyId') {
      console.log('\n💡 Access Key không hợp lệ!');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n💡 Secret Access Key sai!');
    }
  }
}

listBuckets();
