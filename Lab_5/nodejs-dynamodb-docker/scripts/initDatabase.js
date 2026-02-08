require('dotenv').config();
const { dynamoDB } = require('../config/database');

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'Products';

// Thêm timeout cho toàn bộ process
const timeout = setTimeout(() => {
  console.error('\n❌ TIMEOUT: Script took too long (30 seconds)');
  console.error('This usually means DynamoDB is not accessible.');
  console.error('\nTroubleshooting:');
  console.error('1. Check if containers are running: docker-compose ps');
  console.error('2. Check DynamoDB logs: docker-compose logs dynamodb-local');
  console.error('3. Restart containers: docker-compose restart');
  process.exit(1);
}, 30000);

const createTable = async () => {
  console.log('='.repeat(50));
  console.log('Starting database initialization...');
  console.log('DynamoDB Endpoint:', process.env.DYNAMODB_ENDPOINT);
  console.log('AWS Region:', process.env.AWS_REGION);
  console.log('Table Name:', TABLE_NAME);
  console.log('='.repeat(50));

  const params = {
    TableName: TABLE_NAME,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    console.log('\n[1/3] Checking existing tables...');
    const existingTables = await dynamoDB.listTables().promise();
    console.log('✓ Connected to DynamoDB!');
    console.log('Existing tables:', existingTables.TableNames.length > 0 ? existingTables.TableNames : 'None');
    
    if (existingTables.TableNames.includes(TABLE_NAME)) {
      console.log(`\n✓ Table "${TABLE_NAME}" already exists!`);
      
      // Mô tả bảng
      const describeResult = await dynamoDB.describeTable({ TableName: TABLE_NAME }).promise();
      console.log('Table status:', describeResult.Table.TableStatus);
      console.log('Item count:', describeResult.Table.ItemCount);
      return;
    }

    console.log(`\n[2/3] Creating table "${TABLE_NAME}"...`);
    await dynamoDB.createTable(params).promise();
    console.log(`✓ Table "${TABLE_NAME}" created!`);

    console.log('\n[3/3] Waiting for table to be active...');
    await dynamoDB.waitFor('tableExists', { TableName: TABLE_NAME }).promise();
    console.log('✓ Table is now active!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'NetworkingError') {
      console.error('\n💡 Network error - DynamoDB container might not be running');
    } else if (error.code === 'UnknownEndpoint') {
      console.error('\n💡 Cannot reach endpoint:', process.env.DYNAMODB_ENDPOINT);
    }
    
    throw error;
  }
};

// Run the script
createTable()
  .then(() => {
    clearTimeout(timeout);
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database initialization completed successfully!');
    console.log('='.repeat(50));
    process.exit(0);
  })
  .catch((error) => {
    clearTimeout(timeout);
    console.log('\n' + '='.repeat(50));
    console.error('❌ Database initialization failed!');
    console.error('Error:', error.message);
    console.log('='.repeat(50));
    process.exit(1);
  });
