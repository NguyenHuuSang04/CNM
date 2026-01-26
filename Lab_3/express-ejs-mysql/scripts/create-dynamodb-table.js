require('dotenv').config();
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Products';

async function createTable() {
  try {
    // Kiểm tra xem bảng đã tồn tại chưa
    try {
      const describeCommand = new DescribeTableCommand({ TableName: TABLE_NAME });
      await client.send(describeCommand);
      console.log(`✅ Bảng "${TABLE_NAME}" đã tồn tại.`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Tạo bảng mới
    const params = {
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'productId', KeyType: 'HASH' }, // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'productId', AttributeType: 'S' }, // String
      ],
      BillingMode: 'PAY_PER_REQUEST', // On-demand billing
    };

    const command = new CreateTableCommand(params);
    const response = await client.send(command);

    console.log('✅ Bảng DynamoDB đã được tạo thành công!');
    console.log(`📊 Tên bảng: ${TABLE_NAME}`);
    console.log(`📍 Region: ${process.env.AWS_REGION}`);
    console.log(`🔑 Partition Key: productId (String)`);
    console.log('\n⏳ Đang chờ bảng sẵn sàng...');

    // Đợi bảng sẵn sàng
    let tableStatus = 'CREATING';
    while (tableStatus === 'CREATING') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const describeCommand = new DescribeTableCommand({ TableName: TABLE_NAME });
      const describeResponse = await client.send(describeCommand);
      tableStatus = describeResponse.Table.TableStatus;
      console.log(`   Trạng thái: ${tableStatus}`);
    }

    console.log('\n✅ Bảng đã sẵn sàng sử dụng!');
  } catch (error) {
    console.error('❌ Lỗi khi tạo bảng:', error.message);
    process.exit(1);
  }
}

createTable();
