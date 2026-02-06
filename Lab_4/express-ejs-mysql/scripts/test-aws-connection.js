require('dotenv').config();
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

async function testAWSConnection() {
  console.log('🔍 Kiểm tra AWS Credentials...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('   AWS_REGION:', process.env.AWS_REGION || '❌ MISSING');
  console.log('   AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ SET (' + process.env.AWS_ACCESS_KEY_ID.substring(0, 10) + '...)' : '❌ MISSING');
  console.log('   AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ SET (***hidden***)' : '❌ MISSING');
  console.log('');

  // Check if using default values
  if (process.env.AWS_ACCESS_KEY_ID === 'your_access_key_here' || 
      process.env.AWS_SECRET_ACCESS_KEY === 'your_secret_key_here') {
    console.log('❌ LỖI: Bạn đang dùng giá trị mặc định trong .env!');
    console.log('');
    console.log('🔧 CÁCH SỬA:');
    console.log('1. Đăng nhập AWS Console: https://console.aws.amazon.com/');
    console.log('2. Vào IAM → Users → Chọn user của bạn');
    console.log('3. Tab "Security credentials" → Create access key');
    console.log('4. Copy Access Key ID và Secret Access Key');
    console.log('5. Paste vào file .env:');
    console.log('   AWS_ACCESS_KEY_ID=AKIA...');
    console.log('   AWS_SECRET_ACCESS_KEY=your-secret-key');
    console.log('');
    process.exit(1);
  }

  // Test connection
  try {
    console.log('🔌 Testing connection to AWS DynamoDB...');
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new ListTablesCommand({});
    const response = await client.send(command);

    console.log('✅ Kết nối AWS thành công!');
    console.log('📊 DynamoDB Tables:');
    if (response.TableNames.length === 0) {
      console.log('   (Chưa có table nào)');
      console.log('');
      console.log('💡 Chạy lệnh: npm run create-tables');
    } else {
      response.TableNames.forEach(table => {
        console.log('   -', table);
      });
    }
    console.log('');

    // Check required tables
    const requiredTables = ['Users', 'Categories', 'Products', 'ProductLogs'];
    const missingTables = requiredTables.filter(t => !response.TableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Thiếu tables:', missingTables.join(', '));
      console.log('💡 Chạy lệnh: npm run create-tables');
    } else {
      console.log('✅ Tất cả tables đã sẵn sàng!');
      console.log('💡 Chạy lệnh: npm run seed (nếu chưa có dữ liệu)');
    }

  } catch (error) {
    console.log('❌ Lỗi kết nối AWS:');
    console.log('');
    
    if (error.name === 'UnrecognizedClientException') {
      console.log('🔴 AWS Credentials KHÔNG HỢP LỆ!');
      console.log('');
      console.log('Kiểm tra lại:');
      console.log('1. Access Key ID đúng chưa?');
      console.log('2. Secret Access Key đúng chưa?');
      console.log('3. IAM User có quyền truy cập DynamoDB chưa?');
    } else if (error.name === 'InvalidSignatureException') {
      console.log('🔴 Secret Access Key SAI!');
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('');
    console.log('🔧 HƯỚNG DẪN LẤY CREDENTIALS:');
    console.log('https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html');
    
    process.exit(1);
  }
}

testAWSConnection();
