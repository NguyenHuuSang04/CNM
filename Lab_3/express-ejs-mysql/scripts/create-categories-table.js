const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDBClient } = require('../config/dynamodb');

const params = {
  TableName: 'Categories',
  KeySchema: [
    { AttributeName: 'categoryId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'categoryId', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

async function createCategoriesTable() {
  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDBClient.send(command);
    console.log('✅ Categories table created successfully!');
    console.log('Table Status:', result.TableDescription.TableStatus);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  Categories table already exists.');
    } else {
      console.error('❌ Error creating Categories table:', error.message);
    }
  }
}

createCategoriesTable();
