require('dotenv').config();
const { DynamoDBClient, DeleteTableCommand } = require('@aws-sdk/client-dynamodb');

async function deleteOldTables() {
  console.log('🗑️  Xóa các bảng cũ (viết thường)...\n');

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const oldTables = ['products', 'users'];

  for (const tableName of oldTables) {
    try {
      console.log(`Đang xóa table: ${tableName}...`);
      await client.send(new DeleteTableCommand({ TableName: tableName }));
      console.log(`✅ Đã xóa: ${tableName}`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`ℹ️  Table ${tableName} không tồn tại (bỏ qua)`);
      } else {
        console.error(`❌ Lỗi khi xóa ${tableName}:`, error.message);
      }
    }
  }

  console.log('\n✅ Hoàn tất! Bây giờ chạy: npm run seed');
}

deleteOldTables();
