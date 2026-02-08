require('dotenv').config();
const { dynamoDB, docClient } = require('../config/database');

async function testConnection() {
  console.log('Testing DynamoDB connection...');
  console.log('Endpoint:', process.env.DYNAMODB_ENDPOINT);
  console.log('Access Key:', process.env.AWS_ACCESS_KEY_ID);
  
  try {
    // Test connection
    const tables = await dynamoDB.listTables().promise();
    console.log('✓ Connection successful!');
    console.log('Existing tables:', tables.TableNames);
    return true;
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

testConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
