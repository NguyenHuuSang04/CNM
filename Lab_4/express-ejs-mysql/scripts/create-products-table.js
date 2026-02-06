const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDBClient } = require('../config/dynamodb');

const params = {
  TableName: 'Products',
  KeySchema: [
    { AttributeName: 'productId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'productId', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

async function createProductsTable() {
  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDBClient.send(command);
    console.log('✅ Products table created successfully!');
    console.log('Table Status:', result.TableDescription.TableStatus);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Products table already exists.');
    } else {
      console.error('❌ Error creating Products table:', error.message);
    }
  }
}

createProductsTable();
