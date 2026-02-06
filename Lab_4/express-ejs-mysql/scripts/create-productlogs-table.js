const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDBClient } = require('../config/dynamodb');

const params = {
  TableName: 'ProductLogs',
  KeySchema: [
    { AttributeName: 'logId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'logId', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

async function createProductLogsTable() {
  try {
    const command = new CreateTableCommand(params);
    const result = await dynamoDBClient.send(command);
    console.log('✅ ProductLogs table created successfully!');
    console.log('Table Status:', result.TableDescription.TableStatus);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('ℹ️  ProductLogs table already exists.');
    } else {
      console.error('❌ Error creating ProductLogs table:', error.message);
    }
  }
}

createProductLogsTable();
